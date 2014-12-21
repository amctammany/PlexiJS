'use strict';

plexi.module('Stage', function (require, define) {
  var _private = {

  };

  var Level = require('Level');
  var World = require('World');

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

  Stage.prototype.loadLevel = function (id) {
    var level = Level.get(id);
    console.log(level);
    level.dirty = true;
    level.init();
    require('World').current().load(level);

  };

  Stage.prototype.reset = function () {
    this.dirty = true;
    this.init();

  };

  Stage.dispatch = {
    'change': function (args) {
      this.reset();
      plexi.publish([['World', 'reset'], ['Game', 'refresh']]);
    },
    loadLevel: function (id) {
      this.reset();
      this.loadLevel(id);
    }

  };


  return define(Stage);
});
