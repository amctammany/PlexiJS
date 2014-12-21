'use strict';

plexi.behavior('Outlet', function (require, define) {

  var Outlet = function () {
    this.addProps(['channel', 'defaultText']);
  };

  Outlet.prototype = {
    init: function (body) {
      console.log('init outlet');
      console.log(body);
      plexi.subscribe(this.prop(body, 'channel'), this.refresh(body));
      body.text = body.defaultText;
    },
    refresh: function (body) {
      return function (newValue) {
        body.text = newValue[0];
        console.log('new Value: ' + newValue);
      };
    },
    draw: function (ctx, body) {
      var text = (this.prop(body, 'text')) ||  this.prop(body, 'defaultText');
      var padding = this.prop(body, 'padding');
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

  };

  return define(Outlet);
});
