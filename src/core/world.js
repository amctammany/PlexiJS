'use strict';

plexi.module('World', function (require, define) {
  var BodyType = require('BodyType');
  var Canvas = require('Canvas');
  var _private = {

  };

  var World = function (id, config) {
    this.id = id;
    plexi.applyConfig(this, config, _private);
  };

  World.createBody = function createBody (type, config) {
    var bodytype = BodyType.get(type);
    if (!config) {
      console.log('Invalid Configuration for BodyType: ' + type);
      return;
    }
    var body = bodytype.createBody(config);
    return body;
  };
  World.prototype.init = function () {
    this.reset();
    return this;
  };
  World.prototype.removeBody = function (body) {
    var index = this.bodies.indexOf(body);
  };

  World.prototype.addBody = function (type, config) {
    var bodytype = BodyType.get(type);
    if (!config) {
      console.log('Invalid Configuration for BodyType: ' + type + '; config ' + config);
      return;
    }
    var body = bodytype.createBody(config);
    this.bodies.push(body);
    body.index = this.bodies.length - 1;
    if (bodytype.init) {
      bodytype.init(body);
      if (body.members) {
        body.members.forEach(function (m) {
          //console.log(m);
          this.bodies.push(m);
        }.bind(this));
      }
    }

    return body;
  };

  World.prototype.load = function (obj) {

    //if (obj.loaded) { return false; }
    obj.bodies = obj.bodies.map(function (b) {
      return this.addBody(b.type, b.config);
    }.bind(this));
    if (obj.hasOwnProperty('loaded')) {obj.loaded = true;}
  };

  World.prototype.reset = function () {
    this.bodies = [];
    this.forces = [];
    this.selection = [];
    this.dragStart = {x: 0, y: 0};
  };

  //World.prototype.select = function (x, y) {
    //var ctx = Canvas.current().ctx;
    //var bodies = this.bodies.filter(function (b) {
      //return BodyType.get(b.type).isPointInPath(ctx, b, x, y);
    //});
    //this.selection = bodies;
    //var type;
    //bodies.forEach(function (b) {
      //type = BodyType.get(b.type);
      //if (!type.select) { return; }
      //type.select(b);
    //});
  //};
  //World.prototype.unselect = function () {
    //var type;
    //this.selection.forEach(function (b) {
      //type = BodyType.get(b.type);
      //if (!type.select) { return; }
      //type.select(b);
    //});
  //};
  //World.prototype.dragSelection = function (x, y) {
    //var dx = this.dragStart.x - x;
    //var dy = this.dragStart.y - y;
    //this.dragStart = {x: x, y: y};
    //var type;
    //this.selection.forEach(function (b) {
      //b.x -= dx;
      //b.y -= dy;
    //});
  //};

  World.dispatch = {
    //select: function (x, y) {
      //this.select(x, y);
    //},
    //unselect: function () {
      //this.unselect();
    //},
    //drag: function (x, y) {
      //console.log(Array.prototype.slice.call(arguments));
      //this.dragSelection(x, y);
    //},

    createBody: function (type, config) {
      return createBody(type, config);
    },
    reset: function () {
      this.reset();
    },

  };

  return define(World);


});
