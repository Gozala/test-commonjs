"use strict";

var Logger = require("./logger").Logger
var test = require("../../test")

exports.Assert = require("../../assert").Assert
exports.run = function run(units, logger) {
  test.run(units, logger || new Logger())
}
