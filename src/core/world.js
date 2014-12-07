'use strict';

plexi.module('World', function (require, define) {
  var BodyType = require('BodyType');
  var Canvas = require('Canvas');
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
      this.addBody(b.type, b.config);
    }.bind(this));
  };

  World.prototype.reset = function () {
    this.bodies = [];
    this.forces = [];
  };

  World.dispatch = {
    select: function (x, y) {
      var ctx = Canvas.current().ctx;
      var bodies = this.bodies.filter(function (b) {
        return BodyType.get(b.type).isPointInPath(ctx, b, x, y);
      });
      //console.log(bodies);
      var type;
      bodies.forEach(function (b) {
        type = BodyType.get(b.type);
        if (!type.select) { return; }
        type.select(b);

      });
    },

    reset: function () {
      this.reset();
    },

  };

  return define(World);


});
