'use strict';

plexi.behavior('Rectangle', function (require, define) {
  var Rectangle = function () {
    this.addProps(['x', 'y', 'width', 'height']);
  };

  Rectangle.prototype = {
    draw: function (ctx, body) {
      ctx.fillStyle = this.prop(body, 'fill');
      ctx.strokeStyle = this.prop(body, 'stroke');
      this.createPath(ctx, body);
      ctx.fill();
      ctx.stroke();
    },

    createPath: function (ctx, body) {
      ctx.beginPath();
      ctx.rect(this.prop(body, 'x'), this.prop(body, 'y'), this.prop(body, 'width'), this.prop(body, 'height'));
    },

    fireAt: function (x, y) {
      console.log(this.id + ' fired at X: ' + x + '; Y ' + y);
    },

    isPointInPath: function (ctx, body, x, y) {
      this.createPath(ctx, body);
      return ctx.isPointInPath(x, y);
    },

  };

  return define(Rectangle);
});
