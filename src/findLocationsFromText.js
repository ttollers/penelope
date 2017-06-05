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
    .map(util.takeWordsBeforeAndAfter)
    .flatten()
    // if no matches we allow as using dandelion and assuming it's clever with other words
    .otherwise(sortedLocations.map(R.objOf("location")))

    .filter(item => {
      const matchesBefore = R.contains(item.before, indicatorWordsBefore);
      if (matchesBefore) return false;
      return !R.contains(item.after, indicatorWordsAfter);
    })
    .pluck("location")
    .uniq();
});
