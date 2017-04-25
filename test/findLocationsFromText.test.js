"use strict";

const findLocationsFromText = require("../src/findLocationsFromText");
const assert = require("chai").assert;

describe("findLocationsFromText()", () => {

  const locations = ["Aston Villa", "Aston", "Wandsworth"];

  it("Should match Aston Villa and not Aston or Wandsworth (very basic)", done => {

    const textArray = require("./fixtures/basic1.json");

    findLocationsFromText(locations, textArray)
      .toArray(res => {
        assert.equal(res.length, 1);
        assert.equal(res[0], "Aston Villa");
        done();
      });
  });


  it("Should not match Aston because of word after", done => {

    const textArray = require("./fixtures/basic2.json");

    findLocationsFromText(locations, textArray)
      .toArray(res => {
        assert.equal(res.length, 0);
        done();
      });
  });

  it("should handle punctuation correctly", done => {

    const textArray = require("./fixtures/punctuationBug.json");

    findLocationsFromText(locations, textArray)
      .toArray(res => {
        assert.equal(res.length, 0);
        done();
      });
  });

  it("should match locations that have / haven't got hyphens", done => {

    const textArray = require("./fixtures/matchHyphens.json");
    findLocationsFromText(locations, textArray)
      .toArray(res => {
        assert.equal(res.length, 1);
        assert.equal(res[0], "Aston Villa");
        done();
      });
  });

});
