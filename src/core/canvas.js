'use strict';

plexi.module('Canvas', function (require, define) {
  var _private = {
    drawMethods: {},
  };
  var BodyType = require('BodyType');

  var Canvas = function (id, config) {
    this.id = id;

    this.properties = ['element', 'width', 'height'];
    this.dirty = true;

    this.$canvas = void 0;
    this.ctx = void 0;

    plexi.applyConfig(this, config, _private);
  };


  Canvas.prototype.init = function () {
    if (!this.valid) {return false;}
    this.$canvas = document.getElementById(this.constants.element);
    this.$canvas = this.$canvas || document.createElement('canvas');
    this.$canvas.width = this.constants.width;
    this.$canvas.height = this.constants.height;
    this.ctx = this.$canvas.getContext('2d');
    //this.width = this.$canvas.width;
    //this.height = this.$canvas.height;
    BodyType.children().forEach(function (t) {
      _private.drawMethods[t.id] = t.draw.bind(t);
    });
    this.dirty = false;
    return this;

  };
  Canvas.prototype.draw = function (world) {
    var ctx = this.ctx;
    ctx.clearRect(0, 0, this.constants.width, this.constants.height);
    world.bodies.forEach(function (body) {
      _private.drawMethods[body.type](ctx, body);
    });
  };


  return define(Canvas);

});
