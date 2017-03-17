"use strict";

const R = require("ramda");
const hl = require("highland");
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({
  "region": "eu-west-1"
});
const dbStreams = hl.streamifyAll(docClient);

const sanitizeSentence = R.compose(
  R.trim,
  R.replace(/\n/g, ""),
  R.replace(/&[^;]+;/g, ''),
  R.replace(/(<([^>]+)>)/ig, ""),
  R.replace(/^.*<p[^>]*>/m, '')
);

module.exports = item => dbStreams.getStream({
    TableName: "EscenicStateStore-prod-article",
    Key: item
  })
  .pluck("Item")
  .map(item => R.reduce(R.concat, [], [
    [item.Title],
    [sanitizeSentence(item.Fields.leadtext)],
    item.Fields.body.split("</p>").map(sanitizeSentence).filter(x => x.length > 0)
  ]))
  .sequence();
