"use strict";

const hl = require("highland");
const R = require("ramda");
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const getFromS3 = hl.wrapCallback((parms, callback) => {
  s3.getObject(parms, callback);
});

module.exports = getFromS3({
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
  .map(R.slice(1, 3))
  .map(R.map(R.compose(R.head, R.split(' / '))))
