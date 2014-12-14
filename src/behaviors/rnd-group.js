'use strict';

plexi.behavior('RandomGroup', function (require, define) {

  var RandomGroup = function () {
    this.addProps(['template', 'rows', 'columns', 'x', 'y', 'width', 'height', 'padding']);

  };

  RandomGroup.prototype = {
    init: function (body) {
      var prop = function (key) {return this.prop(body, key);}.bind(this);
      body.itemWidth = (prop('width') - (prop('padding') * (prop('columns') + 1))) / prop('columns');
      body.itemHeight = (prop('height') - (prop('padding') * (prop('rows') + 1))) / prop('rows');
      body.tId = prop('template');
      var template = require('BodyType').get(body.tId);
      var RandomGroup = Array.apply(0, new Array(prop('columns') * prop('rows'))).map(function () { return {};});
      body.members = RandomGroup.map(function (item) {
        var i = RandomGroup.indexOf(item);
        var row = Math.floor(i / prop('columns'));
        var column = i % prop('columns');
        item.fill = prop('fills')[Math.floor(Math.random() * prop('fills').length)];
        item.x = prop('x') + prop('padding') + (prop('padding') + body.itemWidth) * column;
        item.y = prop('y') + prop('padding') + (prop('padding') + body.itemHeight) * row;
        item.width = body.itemWidth - prop('padding');
        item.height = body.itemHeight - prop('padding');
        var b = template.createBody(item);
        return b;
      }.bind(this));
      body.initialized = true;

    },
    draw: function (ctx, body) {
      if (!body.initialized) {this.init(body);}
      var template = plexi.module('BodyType').get(body.tId);
      ctx.fillStyle = 'black';
      ctx.fillRect(this.prop(body, 'x'), this.prop(body, 'y'), this.prop(body, 'width'), this.prop(body, 'height'));
      //body.members.forEach(function (b) {
        //template.draw(ctx, b);
      //});
    },

    createPath: function (ctx, body) {
      var prop = function (key) {return this.prop(body, key);}.bind(this);
      if (!body.initialized) {this.init(body);}
      ctx.beginPath();
      ctx.rect(prop('x'), prop('y'), prop('width'), prop('height'));
      ctx.closePath();
    },

    isPointInPath: function (ctx, body, x, y) {
      this.createPath(ctx, body);
      return ctx.isPointInPath(x, y);
    },

  };

  return define(RandomGroup);

});

