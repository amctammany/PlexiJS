'use strict';

plexi.behavior('LevelTiled', function (require, define) {

  var Tiled = function () {
    this.addProps(['rows', 'columns', 'template']);
    this.length = this.prop(this, 'rows') * this.prop(this, 'columns');
    this.cells = Array.apply(0, new Array(this.length)).map(function () {return {};});
  };
  Tiled.prototype = {
    init: function () {
      if (!this.dirty) { return false; }
      var prop = function (key) {return this.prop(this, key);}.bind(this);
      var type = require('BodyType').get(prop('template').id);
      var tileWidth = prop('width') / prop('columns');
      var tileHeight = prop('height') / prop('rows');

      var pos;
      var rows = prop('rows'), columns = prop('columns');
      var x = prop('x'), y = prop('y');
      this.bodies = this.cells.map(function (cell, index) {
        pos = plexi.getGridPosition(index, rows, columns);
        return {type: type.id,  config: {x: x + (pos.col * tileWidth), y: y + (pos.row * tileHeight), fill: prop('template').fill(), index: index, width: tileWidth, height: tileHeight }};
      }.bind(this));

    },
  };

  return define(Tiled);

});
