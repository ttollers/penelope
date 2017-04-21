"use strict";

const index = require("../index");
const getLocationsFromS3 = require("../scripts/getLocationsFromS3");
const getExampleFromDynamo = require("../scripts/getExampleFromDynamo");

// this test is skipped by default as it uses external resources
// this is more uses to be able to run function from end to end with real data
xdescribe("index()", function() {

  this.timeout(60000);
  
  it("Should do one hefty one!", done => {

    getExampleFromDynamo({
      "Id": 12830593,
      "Source": "regionals-article"
    })
      .collect()
      .flatMap(textArray => {
        return getLocationsFromS3()
          .collect()
          .map(index.orderLocationsByLength)
          .flatMap(locations => index.getLocations(locations, textArray));
      })
      .toArray(res => {
        console.log(res);
        done();
      });
  });

});
