'use strict';

plexi.behavior('Label', function (require, define) {
  var Label = function () {
    this.addProps(['x', 'y', 'width', 'text', 'textColor', 'padding']);
  };

  Label.prototype = {
    draw: function (ctx, body) {
      var padding = this.prop(body, 'padding');
      var text = this.prop(body, 'text');
      var w = this.prop(body, 'width');
      var h = this.prop(body, 'height');
      var x = this.prop(body, 'x');
      var y = this.prop(body, 'y');

      this.createPath(ctx, body);
      ctx.font = '20px Arial';
      var width = ctx.measureText(text).width;
      ctx.beginPath();
      ctx.fillText(text, x + (padding + w - width) /2, y + 10 + h / 2 );
    },
    createPath: function (ctx, body) {
      var padding = this.prop(body, 'padding');
      ctx.font = '20px Arial';
      var width = this.prop(body, 'width') || ctx.measureText(this.prop(body, 'text')).width;
      var height = this.prop(body, 'height') || 20;
      ctx.beginPath();
      ctx.rect(this.prop(body, 'x'), this.prop(body, 'y'), width + padding, height + padding);
      ctx.closePath();

    },
    isPointInPath: function (ctx, body, x, y) {
      this.createPath(ctx, body);
      return ctx.isPointInPath(x, y);
    },

  };

  return define(Label);
});
