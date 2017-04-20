"use strict";

const findLocationsFromText = require("./src/findLocationsFromText");
const util = require("./src/util");

module.exports = {
  getLocations: findLocationsFromText,
  orderLocationsByLength: util.orderLocationsByLength,
  sanitizeText: util.sanitizeText
};
