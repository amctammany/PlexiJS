'use strict'

plexi.behavior('WorldSelectable', function (require, define) {
  var Selectable = function () {
    this.selection = [];
  };
  var Canvas = require('Canvas');
  var BodyType = require('BodyType');
  Selectable.prototype.select = function (x, y) {
    //this.dragStart.x = x;
    //this.dragStart.y = y;
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
    return bodies;
  };
  Selectable.prototype.unselect = function () {
    var type;
    this.selection.forEach(function (b) {
      type = BodyType.get(b.type);
      if (!type.select) { return; }
      type.select(b);
    });
  };

  Selectable.dispatch = {
    select: function (x, y) {
      return this.select(x, y);
    },
    unselect: function () {
      this.unselect();
    },
  };

  return define(Selectable);
});
