"use strict";

const hl = require("highland");
const R = require("ramda");
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const getFromS3 = hl.wrapCallback((parms, callback) => {
  s3.getObject(parms, callback);
})

const log = R.compose ( console.log, R.partialRight ( JSON.stringify, [ null, 4 ] ) );

const indicatorWords = [
  'in', 'near', 'from', 'around', 'of', 'on', 'beside', 'at',
  'Street', 'St', 'Road', 'Rd', 'Crescent', 'Crsnt', 'Avenue', 'Av', 'Court', 'Crt', 'Close', 'Cls'
]
const docClient = new AWS.DynamoDB.DocumentClient({
  "region": "eu-west-1"
});

const dbStreams = hl.streamifyAll(docClient);

const sanitizeSentence = R.compose(
  R.trim,
  R.replace(/\n/g, ""),
  R.replace(/&[^;]+;/g, ''),
  R.replace(/(<([^>]+)>)/ig, ""),
  R.replace ( /^.*<p[^>]*>/m, '' )
);

const capFilter = R.compose (
  R.filter(R.compose(R.flip(R.contains)(indicatorWords), R.prop(0))),
  R.filter(R.compose(R.test(/^[A-Z]/), R.prop(1))),
  R.aperture(6),
  R.flip(R.concat)(R.times(R.always('a'),4)),
  R.reject(R.isEmpty),
  R.map(R.replace(/[^A-Za-z]+$/, '')),
  R.split(/\s+/)
);

const calculateScore = (place) => {

};

const findNgramIn = R.curry((a, b) => {
  if (R.length(a) > R.length(b)) {
    return -1;
  }
  return R.reduce((foundAtIndex,bIndex) => {
    return R.reduce((matched, aIndex) => {
      return matched && a[aIndex] === b[bIndex + aIndex];
    }, true, R.range(0, R.length(a))) ? bIndex : foundAtIndex;
  }, -1, R.range(0, R.length(b) - R.length(a) + 1));
});

dbStreams.getStream({
  TableName: "EscenicStateStore-prod-article",
  Key: {
    Id: 12747580,
    Source: "regionals-article"
  }
})
  .pluck("Item")
  .map(item => R.reduce ( R.concat, [], [
    [ item.Title ],
    [ sanitizeSentence(item.Fields.leadtext) ],
    item.Fields.body.split("</p>").map(sanitizeSentence).filter(x => x.length > 0)
  ] ) )
  .sequence ()
  .map (sentence => (sentence.replace(/\./g, '') + ' '), R.compose(R.join(' '), R.tail, R.split(/\s+/)))
  .reduce1(R.concat)
  .map(capFilter)
  .toCallback((err, quintaGrams) => {
      if ( err ) {
        return console.error ( err );
      }
    getFromS3({
      Bucket: "tm-ep-inyourarea-locations",
      Key: "csv/uk-towns.csv"
    })
      .pluck("Body")
      .invoke("toString", ["utf-8"])
      .map(R.split("\n"))
      .map(R.tail)
      .sequence()
      .reject(R.isEmpty)
      .map(R.split(','))
      .map(R.slice(1,3))
      .map(R.map(R.compose(R.head, R.split(' / '))))
      .map(placeTuple => {
        const placeNgram = placeTuple[0].split(' ');
        const countyNgram = placeTuple[1].split(' ');

        return {
          place: placeTuple,
          foundPlaces: R.reject(R.equals(-1),R.map(findNgramIn(placeNgram),quintaGrams)),
          foundCounties: R.reject(R.equals(-1),R.map(findNgramIn(countyNgram),quintaGrams))
        };
      })
      .reject(place => {
        return R.isEmpty(place.foundPlaces);
      })
      .stopOnError(console.error)
      .each(log);
  })
