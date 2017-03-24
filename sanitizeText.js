"use strict";
const R = require("ramda");

module.exports = R.compose(
  R.trim,
  R.replace(/\n/g, ""),
  R.replace(/&[^;]+;/g, ""),
  R.replace(/(<([^>]+)>)/ig, ""),
  R.replace(/^.*<p[^>]*>/m, "")
);
