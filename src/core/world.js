'use strict';

plexi.module('World', function (require, define) {
  var BodyType = require('BodyType');
  var _private = {

  };

  var World = function (id, config) {
    this.id = id;
    plexi.applyConfig(this, config, _private);
  };


  World.prototype.init = function () {
    this.bodies = [];
    this.forces = [];
    return this;
  };

  World.prototype.addBody = function (type, config) {
    var body = BodyType.get(type).createBody(config);
    this.bodies.push(body);
    return body;
  };

  World.prototype.load = function (obj) {
    obj.bodies.forEach(function (b) {
      this.addBody(b.type, b);
    }.bind(this));
  };

  World.prototype.reset = function () {
    this.bodies = [];
    this.forces = [];
  };

  return define(World);


});
