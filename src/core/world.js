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
    this.reset();
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
    this.selection = [];
    this.dragStart = {x: 0, y: 0}
  };

  World.prototype.select = function (x, y) {
    this.dragStart.x = x;
    this.dragStart.y = y;
    var ctx = Canvas.current().ctx;
    var bodies = this.bodies.filter(function (b) {
      return BodyType.get(b.type).isPointInPath(ctx, b, x, y);
    });
    this.selection = bodies;
    var type;
    bodies.forEach(function (b) {
      type = BodyType.get(b.type);
      if (!type.select) { return; }
      type.select(b);
    });
  };
  World.prototype.unselect = function () {
    var type;
    this.selection.forEach(function (b) {
      type = BodyType.get(b.type);
      if (!type.select) { return; }
      type.select(b);
    });
  };
  World.prototype.dragSelection = function (x, y) {
    var dx = this.dragStart.x - x;
    var dy = this.dragStart.y - y;
    this.dragStart = {x: x, y: y};
    var type;
    this.selection.forEach(function (b) {
      b.x -= dx;
      b.y -= dy;
    });
  };

  World.dispatch = {
    select: function (x, y) {
      this.select(x, y);
    },
    unselect: function () {
      this.unselect();
    },
    drag: function (x, y) {
      this.dragSelection(x, y);
    },

    reset: function () {
      this.reset();
    },

  };

  return define(World);


});
