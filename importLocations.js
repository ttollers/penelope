"use strict";

const hl = require("highland");
const R = require('ramda');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const getFromS3 = hl.wrapCallback(cb => {
  s3.getObject({
    Bucket: "tm-ep-inyourarea-locations",
    Key: "csv/uk-towns.csv"
  }, cb);
});

getFromS3()
  .pluck("Body")
  .invoke("toString", ["utf-8"])
  .toCallback((err, res) => {
      console.log(res.split("\n").map(R.compose(R.prop(1),R.split(/[\/,]/))).filter(R.compose(R.not, R.isNil)).map(R.compose(R.length,R.split(/\s+/))).reduce(R.max,0));
      
  })
