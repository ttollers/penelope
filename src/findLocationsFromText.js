"use strict";

const hl = require("highland");
const R = require("ramda");
const util = require("./util");

// Locations must be sorted inversely by string length BEFORE this point
// findLocationsFromText :: [String] -> [String] -> Stream[String]
module.exports = R.curry((indicatorWordsBefore, indicatorWordsAfter, sortedLocations, textArray) => {
  return hl(textArray)
    .map(util.sanitizeText)
    .map(R.compose(
      R.replace(/-/g, " "),
      R.replace(/'/g, "")
    ))
    .reject(R.isEmpty)
    .map(sentence => (`${sentence.replace(/\./g, "")  } `), R.compose(R.join(" "), R.tail, R.split(/\s+/)))
    .map(util.matchWords(sortedLocations))
    .reject(R.compose(R.isEmpty, R.prop("locations")))
    .map(util.takeWordsBeforeAndAfter(1, 1))
    .flatten()
    .filter(item => {
      const matchesBefore = R.any(R.flip(R.contains)(indicatorWordsBefore))(item.before);
      if (matchesBefore) return false;
      return !R.any(R.flip(R.contains)(indicatorWordsAfter))(item.after);
    })
    .pluck("location")
    .uniq();
});
