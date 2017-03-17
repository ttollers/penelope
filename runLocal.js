"use strict";

const R = require("ramda");
const getLocationsFromS3 = require("./getLocationsFromS3");
const getExampleDynamodbData = require("./getExampleDynamodbData");
const findLocationsFromText = require("./findLocationsFromText");

const log = R.compose(console.log, R.partialRight(JSON.stringify, [null, 4]));

getLocationsFromS3
  .collect()
  .flatMap(locations => {
    return getExampleDynamodbData({
      Id: 12747580,
      Source: "regionals-article"
    })
      .collect()
      .flatMap(findLocationsFromText(locations))
  })
  .stopOnError(console.error)
  .each(log);
