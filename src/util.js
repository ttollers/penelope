"use strict";

const R = require("ramda");

// orderLocationsByLength :: [String] -> [String]
exports.orderLocationsByLength = R.sort((a, b) => b.length - a.length);

// matchWords :: [String] -> String -> {text: String, locations: [String]}
exports.matchWords = R.curry((townList, text) => {
  const townsInRegex = townList.map(x => x.trim()).join("|");
  const regexTest = new RegExp(`(^|[^a-zA-Z0-9])(${townsInRegex})([^a-zA-Z0-9]|$)`, "g");
  const matches = text.match(regexTest) || [];
  const locationsMatched = R.uniq(matches.filter(i => i).map(x => x.replace(/^[^a-zA-Z0-9]/, "").replace(/[^a-zA-Z0-9]$/, ""))) || [];
  return {
    text: text,
    locations: locationsMatched
  };
});

// takeWordsBeforeAndAfter :: {text: String, locations: [String]} -> [{location: String, before: [String], after: [String]}]
exports.takeWordsBeforeAndAfter = textWithLocationsObject => {
  const text = textWithLocationsObject.text;
  return textWithLocationsObject.locations
    .map(x => x.trim())
    .map(location => {
      const split = text.split(location).map(R.split(/\s+/)).map(R.reject(R.isEmpty));
      return {
        location: location,
        before: R.takeLast(6, split[0]),
        after: R.take(6, split[1])
      };
    });
};

// sanitizeText :: String -> String
exports.sanitizeText = R.compose(
  R.trim,
  R.replace(/\n/g, ""),
  R.replace(/&[^;]+;/g, ""),
  R.replace(/(<([^>]+)>)/ig, ""),
  R.replace(/^.*<p[^>]*>/m, "")
);
