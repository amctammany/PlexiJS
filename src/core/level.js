'use strict';

plexi.module('Level', function (require, define) {
  var _private = {

  };


  var Level = function (id, config) {
    this.id = id;
    this.config = config;
    this.bodies = [];
    this.dirty = true;
    this.loaded = false;
    plexi.applyConfig(this, config, _private);
  };

  Level.prototype.init = function () {
    if (!this.dirty) {return false;}
    if (this.loaded === true) { return; }
    console.log('regular init');
    this.bodies = this.config.bodies.map(function (body) {
      return {type: body.type, config: body};
    });
    this.loaded = false;
    this.dirty = false;
    return this;
  };

  Level.prototype.reset = function () {
    this.dirty = true;
    //this.init();
  };

  Level.dispatch = {
    change: function (id) {
      //console.log('changed level');
      this.reset();
      plexi.publish(['Stage', 'loadLevel', id]);
    },
    flush: function (index) {
      console.log(index);
    },
  };

  return define(Level);

});
