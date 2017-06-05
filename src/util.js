"use strict";

const R = require("ramda");

// purgeLeadingAndTrailingPunctuation :: String -> String
const purgeLeadingAndTrailingPunctuation = R.compose(
  R.replace(/^[^a-zA-Z0-9]/, ""),
  R.replace(/[^a-zA-Z0-9]$/, "")
);

// orderLocationsByLength :: [String] -> [String]
exports.orderLocationsByLength = R.sort((a, b) => b.length - a.length);

// matchWords :: [String] -> String -> {text: String, locations: [String]}
exports.matchWords = R.curry((townList, text) => {

  const townsInRegex = townList
    .map(R.trim)
    .join("|");

  const regexTest = new RegExp(`(^|[^a-zA-Z0-9])(${townsInRegex})([^a-zA-Z0-9]|$)`, "g");
  const matches = text.match(regexTest) || [];
  const locationsMatched = R.uniq(matches.filter(i => i).map(purgeLeadingAndTrailingPunctuation)) || [];
  return {
    text: text,
    locations: locationsMatched
  };
});

// takeWordsBeforeAndAfter :: {text: String, locations: [String]} -> [{location: String, before: [String], after: [String]}]
exports.takeWordsBeforeAndAfter = R.curry((textWithLocationsObject) => {
  const text = textWithLocationsObject.text;
  return textWithLocationsObject.locations
    .map(x => x.trim())
    .map(location => {
      const splits = text.split(location)
        .map(R.split(/\s+/))
        .map(R.compose(
          R.map(purgeLeadingAndTrailingPunctuation),
          R.reject(R.isEmpty))
        );

      return splits.reduce((acc, words) => {
          if(acc.length < splits.length - 1) {
            acc[acc.length] = {
              location: location,
              before: R.last(words)
            };
          }
          if(acc.length > 0) {
            acc[acc.length -1].after = R.head(words)
          }
          return acc;
        }, []);
    });
});

// sanitizeText :: String -> String
exports.sanitizeText = R.compose(
  R.trim,
  R.replace(/\n/g, ". "),
  R.replace(/&[^;]+;/g, ""),
  R.replace(/(<([^>]+)>)/ig, ""),
  R.replace(/^.*<p[^>]*>/m, "")
);

