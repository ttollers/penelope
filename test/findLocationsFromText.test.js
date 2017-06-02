"use strict";

const { getLocations }= require("../index");
const assert = require("chai").assert;

describe("getLocations()", () => {

  const locations = ["Aston Villa", "Aston", "Wandsworth"];

  it("Should match Aston Villa and not Aston or Wandsworth (very basic)", done => {

    const textArray = require("./fixtures/basic1.json");

    getLocations(locations, textArray)
      .toArray(res => {
        assert.equal(res.length, 1);
        assert.equal(res[0], "Aston Villa");
        done();
      });
  });


  it("Should not match Aston because of word after", done => {

    const textArray = require("./fixtures/basic2.json");

    getLocations(locations, textArray)
      .toArray(res => {
        assert.equal(res.length, 0);
        done();
      });
  });

  it("should handle punctuation correctly", done => {

    const textArray = require("./fixtures/punctuationBug.json");

    getLocations(locations, textArray)
      .toArray(res => {
        assert.equal(res.length, 0);
        done();
      });
  });

  it("should match locations that have / haven't got hyphens", done => {

    const textArray = require("./fixtures/matchHyphens.json");
    getLocations(locations, textArray)
      .toArray(res => {
        assert.equal(res.length, 1);
        assert.equal(res[0], "Aston Villa");
        done();
      });
  });

  it("should match locations with apostrophes", done => {
    const textArray = [
      "Should match in King's Norton"
    ];
    getLocations(["Kings Norton"], textArray)
      .toArray(res => {
        assert.equal(res.length, 1);
        assert.equal(res[0], "Kings Norton");
        done();
      });
  });

  it("should match location if first mention doesn't match but subsequent do in same sentence", done => {
    const textArray = [
      "Shouldn't match Aston Villa Boelevard should match in Aston Villa here"
    ];
    getLocations(locations, textArray)
      .toArray(res => {
        assert.equal(res.length, 1);
        assert.equal(res[0], "Aston Villa");
        done();
      });
  });

});
