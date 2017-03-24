"use strict";

const findLocationsFromText = require("./findLocationsFromText");
const sanitizeText = require("./sanitizeText");

module.exports = {
  getLocations: findLocationsFromText,
  sanitizeText: sanitizeText
};
