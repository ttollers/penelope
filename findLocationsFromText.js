"use strict";

const hl = require("highland");
const R = require("ramda");
const getLocationsFromS3 = require("./getLocationsFromS3");
const getExampleDynamodbData = require("./getExampleDynamodbData");

const indicatorWords = [
  'in', 'near', 'from', 'around', 'of', 'on', 'beside', 'at',
  'Street', 'St', 'Road', 'Rd', 'Crescent', 'Crsnt', 'Avenue', 'Av', 'Court', 'Crt', 'Close', 'Cls'
];

const capFilter = R.compose(
  R.filter(R.compose(R.flip(R.contains)(indicatorWords), R.prop(0))),
  R.filter(R.compose(R.test(/^[A-Z]/), R.prop(1))),
  R.aperture(6),
  R.flip(R.concat)(R.times(R.always('a'), 4)),
  R.reject(R.isEmpty),
  R.map(R.replace(/[^A-Za-z]+$/, '')),
  R.split(/\s+/)
);

const findNgramIn = R.curry((a, b) => {
  if (R.length(a) > R.length(b)) {
    return -1;
  }
  return R.reduce((foundAtIndex, bIndex) => {
    return R.reduce((matched, aIndex) => {
      return matched && a[aIndex] === b[bIndex + aIndex];
    }, true, R.range(0, R.length(a))) ? bIndex : foundAtIndex;
  }, -1, R.range(0, R.length(b) - R.length(a) + 1));
});

const sanitizeSentence = R.compose(
  R.trim,
  R.replace(/\n/g, ""),
  R.replace(/&[^;]+;/g, ''),
  R.replace(/(<([^>]+)>)/ig, ""),
  R.replace(/^.*<p[^>]*>/m, '')
);


module.exports = R.curry((locations, textArray) => {
  return hl(textArray)
    .map(sanitizeSentence)
    .filter(x => x.length > 0)
    .map(sentence => (sentence.replace(/\./g, '') + ' '), R.compose(R.join(' '), R.tail, R.split(/\s+/)))
    .map(capFilter)
    .reduce1(R.concat)
    .flatMap(quintaGrams => {
      return hl(locations)
        .map(placeTuple => {
          const placeNgram = placeTuple[0].split(' ');
          const countyNgram = placeTuple[1].split(' ');

          return {
            place: placeTuple,
            foundPlaces: R.reject(R.equals(-1), R.map(findNgramIn(placeNgram), quintaGrams)),
            foundCounties: R.reject(R.equals(-1), R.map(findNgramIn(countyNgram), quintaGrams))
          };
        })
        .reject(place => {
          return R.isEmpty(place.foundPlaces);
        })
    });
});
