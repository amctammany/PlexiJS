'use strict';

plexi.module('Stage', function (require, define) {
  var _private = {

  };

  var Level = require('Level');

  var Stage = function (id, config) {
    this.id = id;
    this.config = config;
    plexi.applyConfig(this, config, _private);

    this.dirty = true;
  };

  Stage.prototype.init = function () {
    if (!this.dirty) { return false; }
    this.bodies = this.config.bodies.map(function (b) {
      return {type: b.type, config: b};
    });

    this.dirty = false;

    return this;
  };

  Stage.prototype.loadLevel = function (level) {

  };

  Stage.prototype.reset = function () {
    this.init();

  };

  return define(Stage);
});
