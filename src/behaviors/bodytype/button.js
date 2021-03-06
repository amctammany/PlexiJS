'use strict';

plexi.behavior('Button', function (require, define) {
  var Button = function () {
    this.addProps(['x', 'y', 'width', 'text', 'action', 'fill', 'textColor', 'padding']);
  };

  Button.klass = 'BodyType';

  Button.prototype = {
    draw: function (ctx, body) {
      ctx.fillStyle = this.prop(body, 'fill');
      this.createPath(ctx, body);
      ctx.fill();
      ctx.fillStyle = this.prop(body, 'textColor');
      this.drawText(ctx, body);
      ctx.fill();
    },

    drawText: function (ctx, body) {
      var padding = this.prop(body, 'padding');
      var text = this.prop(body, 'text');
      var w = this.prop(body, 'width');
      var h = this.prop(body, 'height');
      var x = this.prop(body, 'x');
      var y = this.prop(body, 'y');
      ctx.font = '20px Arial';
      var width = ctx.measureText(text).width;
      ctx.beginPath();
      ctx.fillText(text, x + (padding + w - width) / 2, y + 10 + h / 2);
      ctx.closePath();

    },

    createPath: function (ctx, body) {
      var padding = this.prop(body, 'padding');
      ctx.font = '20px Arial';
      var width = this.prop(body, 'width') || ctx.measureText(this.prop(body, 'text')).width;
      var height = this.prop(body, 'height') || 20;
      ctx.beginPath();
      ctx.rect(this.prop(body, 'x'), this.prop(body, 'y'), width + padding, height + padding);
      ctx.closePath();
      //ctx.text(body.x + (width / 2), body.y, this.prop('text'));
    },

    isPointInPath: function (ctx, body, x, y) {
      this.createPath(ctx, body);
      return ctx.isPointInPath(x, y);
    },

    select: function (body) {
      plexi.publish(this.prop(body, 'action'));
    },

  };

  return define(Button);
});
