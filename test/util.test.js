"use strict";

const assert = require("chai").assert;

describe("matchWords()", () => {

  const matchWords = require("../src/util").matchWords;
  const locations = ["Aston", "Wandsworth"];

  it("Should not match", () => {
    const text = "This text should not match";
    const actual = matchWords(locations, text);
    assert.deepEqual(actual.locations, []);
    assert.equal(actual.text, text);
  });

  it("Should match Aston", () => {
    const text = "This text should match Aston";
    const actual = matchWords(locations, text);
    assert.deepEqual(actual.locations, ["Aston"]);
    assert.equal(actual.text, text);
  });
});

describe("orderLocationsByLength()", () => {

  const orderLocationsByLength = require("../src/util").orderLocationsByLength;
  const locations = ["Aston", "Aston Villa", "Wandsworth"];

  it("should return order list by length", () => {
    const actual = orderLocationsByLength(locations);
    assert.deepEqual(actual, ["Aston Villa", "Wandsworth", "Aston"]);
  });

});


describe("takeWordsBeforeAndAfter()", () => {

  const takeWordsBeforeAndAfter = require("../src/util").takeWordsBeforeAndAfter;

  it("should take the correct words before and after", () => {
    const given = {
      text: "This should be before Aston this is after",
      locations: ["Aston"]
    };
    const actual = takeWordsBeforeAndAfter(given);
    assert.equal(actual.length, 1);
    assert.equal(actual[0].location, "Aston");
    assert.deepEqual(actual[0].before, ["This", "should", "be", "before"]);
    assert.deepEqual(actual[0].after, ["this", "is", "after"]);
  });

  it("should still split correctly with more than one location", () => {
    const given = {
      text: "This should be before Aston this is between Wandsworth this if after all",
      locations: ["Aston", "Wandsworth"]
    };
    const actual = takeWordsBeforeAndAfter(given);
    assert.equal(actual.length, 2);

    assert.equal(actual[0].location, "Aston");
    assert.deepEqual(actual[0].before, ["This", "should", "be", "before"]);
    assert.deepEqual(actual[0].after, ["this", "is", "between", "Wandsworth", "this", "if"]);

    assert.equal(actual[1].location, "Wandsworth");
    assert.deepEqual(actual[1].before, ["be", "before", "Aston", "this", "is", "between"]);
    assert.deepEqual(actual[1].after, ["this", "if", "after", "all"]);
  });

  it("should split on locations with punctuation chars", () => {
    const given = {
      text: "This should be before Aston-Villa this is after",
      locations: ["Aston-Villa"]
    };
    const actual = takeWordsBeforeAndAfter(given);
    assert.equal(actual.length, 1);
    assert.equal(actual[0].location, "Aston-Villa");
    assert.deepEqual(actual[0].before, ["This", "should", "be", "before"]);
    assert.deepEqual(actual[0].after, ["this", "is", "after"]);
  });

});

describe("sanitizeText()", () => {

  const sanitizeText = require("../src/util").sanitizeText;

  it("should clean a string", () => {
    const given = sanitizeText("  <p>Some dodgey !@£$%^&*() tezt</p>   \n   <br>      ");
    assert.equal(given, "Some dodgey !@£$%^&*() tezt");
  });
});
