"use strict";

var EDriver = require("./lib/EDriver");

module.exports = {

  driver: function(opts) {
    return new EDriver(opts);
  }
};
