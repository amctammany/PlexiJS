'use strict';

plexi.behavior('WorldDraggable', function (require, define) {
  var Draggable = function () {
    this.selection = [];
    this.dragStart = {};
  };
  var Canvas = require('Canvas');
  var BodyType = require('BodyType');
  Draggable.prototype.select = function (x, y) {
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
  Draggable.prototype.unselect = function () {
    var type;
    this.selection.forEach(function (b) {
      type = BodyType.get(b.type);
      if (!type.select) { return; }
      type.select(b);
    });
  };
  Draggable.prototype.dragSelection = function (x, y) {
    //console.log('drag from behavior');
    var dx = this.dragStart.x - x;
    var dy = this.dragStart.y - y;
    this.dragStart = {x: x, y: y};
    var type;
    this.selection.forEach(function (b) {
      b.x -= dx;
      b.y -= dy;
    });
  };

  Draggable.dispatch = {
    drag: function (x, y) {
      //console.log(Array.prototype.slice.call(arguments));
      this.dragSelection(x, y);
    },
  };

  return define(Draggable);
});
