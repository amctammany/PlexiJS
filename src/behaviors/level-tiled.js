'use strict';

plexi.behavior('LevelTiled', function (require, define) {
  var World = require('World');

  var Tiled = function () {
    this.addProps(['rows', 'columns', 'template']);
    this.size = this.prop(this, 'rows') * this.prop(this, 'columns');
    this.cells = Array.apply(0, new Array(this.size)).map(function () {return {};});
  };
  Tiled.prototype = {
    init: function () {
      if (!this.dirty) { return false; }
      console.log('init level-tiled')
      var prop = function (key) {return this.prop(this, key);}.bind(this);
      var type = require('BodyType').get(prop('template').id);
      var tileWidth = prop('width') / prop('columns');
      var tileHeight = prop('height') / prop('rows');

      var pos;
      var rows = prop('rows'), columns = prop('columns');
      var x = prop('x'), y = prop('y');
      this.bodyConfs = this.cells.map(function (cell, index) {
        pos = plexi.getGridPosition(index, rows, columns);
        var row = pos.row, column = pos.column;
        return {type: type.id,  config: {x: x + (column * tileWidth), y: y + (row * tileHeight), fill: prop('template').fill(), index: index, row: row, column: column, width: tileWidth, height: tileHeight }};
      });

    },
    getIndex: function (row, column) {
      var columns = this.prop(this, 'columns');
      return (row * columns) + column;

    },
  };

    return define(Tiled);

});
