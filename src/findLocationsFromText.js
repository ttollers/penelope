"use strict";

const hl = require("highland");
const R = require("ramda");
const util = require("./util");

const indicatorWordsBefore = require("./indicatorWordsBefore.json");
const indicatorWordsAfter = require("./indicatorWordsAfter.json");

// Locations must be sorted inversely by string length BEFORE this point
// findLocationsFromText :: [String] -> [String] -> Stream[String]
module.exports = R.curry((sortedLocations, textArray) => {
  return hl(textArray)
    .map(util.sanitizeText)
    .reject(R.isEmpty)
    .map(sentence => (`${sentence.replace(/\./g, "")  } `), R.compose(R.join(" "), R.tail, R.split(/\s+/)))
    .map(util.matchWords(sortedLocations))
    .reject(R.compose(R.isEmpty, R.prop("locations")))
    .map(util.takeWordsBeforeAndAfter)
    .sequence()
    .filter(item => {
      const matchesBefores = R.any(R.flip(R.contains)(indicatorWordsBefore))(item.before);
      if (matchesBefores) return true;
      return R.any(R.flip(R.contains)(indicatorWordsAfter))(item.after);
    })
    .pluck("location")
    .uniq();
});
