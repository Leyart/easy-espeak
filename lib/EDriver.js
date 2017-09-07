/*
 * ESpeak Driver
 *
 * Leyart
*/
var spawn = require("child_process").spawn;
var LANGUAGES = require("./languages");

var EDriver = module.exports = function EDriver(opts) {

  opts = opts || {};
  this.voice = opts.voice;
  this.language = opts.language || "en";
  this.gender = opts.gender || "f";
  this.variant = opts.variant || "1";
  this.speed = opts.speed || 120;
};

/**
 * Speaks the provided text
 *
 * @param {String} text text to say
 * @param {Function} callback function to be called when done
 * @return {void}
 * @publish
 */
EDriver.prototype.say = function(text, callback) {
  this.say(text, this._findVoice(), this.speed, callback);
};

EDriver.prototype._findVoice = function() {
  if (this.voice) {
    return this.voice;
  }

  var lang = this.languages()[this.language],
      variant = this.variant,
      gender = this.gender;

  return lang + "+" + gender + variant;
};

/**
 * Speaks the provided text
 *
 * @param {String} text text to say
 * @param {String} voice options for voice
 * @param {Number} speed speed of voice
 * @param {Function} callback callback to be invoked when done
 * @return {void}
 * @publish
 */
EDriver.prototype.say = function(text, callback) {
  this.espeak = spawn("espeak", ["-s", this.speed, "-v", this.voice, text]);
  this.espeak.stderr.on("data", function(err) {
    console.error("espeak error: "+err);
  });

  this.espeak.stdin.on("error", function(err) {
    console.error("espeak error:"+err);

    if (err.code === "EPIPE") {
      return;
    }

    throw err;
  });

  this.espeak.on("close", function() {
    //this.emit("finished");
    if (typeof callback === "function") {
      callback();
    }
  }.bind(this));
};

/**
 * Returns hash with all of the currently supported languages
 *
 * @return {Object} languages that are currently supported
 * @publish
 */
EDriver.prototype.languages = function() {
  return LANGUAGES;
};
