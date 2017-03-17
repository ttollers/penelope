"use strict";

const R = require("ramda");
const hl = require("highland");
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({
  "region": "eu-west-1"
});
const dbStreams = hl.streamifyAll(docClient);

module.exports = item => dbStreams.getStream({
    TableName: "EscenicStateStore-prod-article",
    Key: item
  })
  .pluck("Item")
  .map(item => R.reduce(R.concat, [], [
    [item.Title],
    [item.Fields.leadtext],
    item.Fields.body.split("</p>")
  ]))
  .sequence();
