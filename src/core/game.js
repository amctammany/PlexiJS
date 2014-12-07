'use strict';

plexi.module('Game', function (require, define) {
  var _private = {
    defaults: function (config) {
      this.defaults = config;
      return this;
    },

  };
  var _world, _stage, _canvas;

  var Game = function (id, config) {
    this.id = id;
    plexi.applyConfig(this, config, _private);
  };
  var _animLoop, _animFn;
  Game.prototype.start = function () {
    _private.paused = false;
    _animFn = this.animate.bind(this);
    _animFn();
  };
  Game.prototype.animate = function () {
    this.advance(0.03);
    _animLoop = window.requestAnimationFrame(_animFn);
  };
  Game.prototype.advance = function (delta) {
    _canvas.draw(_world);
    //this.current.Canvas.draw(this.current.World);
  };
  Game.prototype.refresh = function () {
    if (_animLoop) {
      window.cancelAnimationFrame(_animLoop);
    }

    var World = require('World');
    var Canvas = require('Canvas');
    var Stage = require('Stage');

    _world = World.current();
    _canvas = Canvas.current();
    _stage = Stage.current();
    _world.load(_stage);
    this.start();
  };

  Game.prototype.reset = function () {
    Object.keys(this.defaults).forEach(function (d) {
      //plexi.publish([d, 'reset']);
    });
    console.log('reset game: ' + this);
  };

  return define(Game);

});
