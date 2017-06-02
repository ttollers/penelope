"use strict";

const findLocationsFromText = require("./src/findLocationsFromText");
const util = require("./src/util");

const indicatorWordsBefore = require("./src/indicatorWordsBefore.json");
const indicatorWordsAfter = require("./src/indicatorWordsAfter.json");

module.exports = {
  getLocations: findLocationsFromText(indicatorWordsBefore, indicatorWordsAfter),
  getLocationsNew: findLocationsFromText,
  orderLocationsByLength: util.orderLocationsByLength,
  sanitizeText: util.sanitizeText
};
