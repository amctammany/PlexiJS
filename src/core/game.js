'use strict';

plexi.module('Game', function (require, define) {
  var _private = {
    defaults: function (config) {
      this.defaults = config;
      return this;
    },
    vars: function (names) {
      if (!names) { return false; }
      this.vars = {};
      this.defVars = names;
      var name;
      Object.keys(names).forEach(function (n) {
        name = 'Game.'+n;
        plexi.subscribe(name, this.updateVar(n));
        this.vars[n] = names[n];
      }.bind(this));
    },

  };
  var _world, _stage, _canvas;

  var Game = function (id, config) {
    this.id = id;
    plexi.applyConfig(this, config, _private);
  };
  Game.prototype.updateVar = function (n) {
    return function (newValue) {
      if (newValue === undefined) {
        return 'undefined';
      }
      if (newValue[0] === '+') {
        console.log('incrementing game varible: ' + n);
        this.vars[n] += newValue[1];
        console.log(this.vars[n]);
      } else {
        console.log('updating game variable: ' + n);
        this.vars[n] = newValue[0];
      }
      return this.vars[n];
    }.bind(this);
  };
  var _animLoop, _animFn;
  Game.prototype.start = function () {
    if (!!this.vars) {

    Object.keys(this.vars).forEach(function(n) {
      this.vars[n] = this.defVars[n];
    }.bind(this));
    }
    //this.vars.forEach(function (n) {
      //plexi.publish(['Game.'+n, this[n]]);
    //}.bind(this));
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

  Game.prototype.getVar = function (key) {
    return this.vars[key];
  };

  Game.dispatch = {
    refresh: function () {
      this.refresh();
    },
  };
  return define(Game);

});
