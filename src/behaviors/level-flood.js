'use strict';

plexi.behavior('LevelFlood', function (require, define) {
  var _private = {


  };
  var directions = [0, 1, 2, 3];

  var Flood = function () {
    this.addProps(['rows', 'columns', 'types']);
    this.floodSet = new Array(this.prop(this, 'size'));
    this.floodFound = 0;
  };

  Flood.prototype = {
    flood: function (row, column, fill) {
      //console.log(this.translateCell(index, 0));
      var index = this.getIndex(row, column);
      var cell = this.bodies[index];
      var first = false;
      if (fill === -1) {
        first = true;
        fill = cell.fill;
      }
      if (cell === null) { return; }
      var columns = this.prop(this, 'columns'), rows = this.prop(this, 'rows');
      if (column >= columns || column < 0 || row >= rows || row < 0) {
        return;
      }
      if (this.floodSet[index] === 1 || (!first && fill !== cell.fill) ) {
        return;
      }
      this.floodSet[index] = 1;
      this.flood(row + 1, column, fill);
      this.flood(row - 1, column, fill);
      this.flood(row, column + 1, fill);
      this.flood(row, column - 1, fill);

      if (first === true && this.floodFound === 0) {
        return;
      }
      this.bodies[index] = null;
      this.floodFound += 1;
      //var next;
      //var flood = directions.reduce(function (prev, current) {
        //next = this.translateCell(prev[prev.length-1], current);
        //if (prev.indexOf(c)) {

        //}
        //console.log(next);
      //}.bind(this), acc);
    },
    shuffleDown: function () {
      for (var column = 0, columns = this.prop(this, 'columns'); column < columns; column++ ) {
        var distance = 0;
        for (var row = 0, rows = this.prop(this, 'rows'); row < rows; row++) {
          if (this.bodies[this.getIndex(row, column)] === null) {
            distance += 1;
          } else {
            if (distance > 0) {
              var cell = this.bodies[this.getIndex(row, column)];
              cell.y += distance * this.prop(cell, 'height');
            }
          }

        }
      }

    },
    translateCell: function (index, direction) {
      var pos = plexi.getGridPosition(index, this.rows, this.columns);
      var newPos;
      switch (direction) {
        case 0:
          newPos = index - this.columns;
          break;
        case 1:
          newPos = index + 1;
          break;
        case 2:
          newPos = index + this.columns;
          break;
        case 3:
          newPos = index - 1;
          break;
        default:
          console.log('Invalid translation');
          newPos = index;
          break;
      }
      if (newPos < 0 || newPos > this.length) {
        console.log('Invalid translation');
        return false;
      }
      return newPos;
    },

  };

  Flood.dispatch = {
    flood: function (row, column) {
      //console.log(this);
      //var index = this.getIndex(row, column);
      //console.log(index);
      //var cell = this.bodies[this.getIndex(row, column)];

      return this.flood(row, column, -1);//, [cell];
      plexi.publish
    },
  };

  return define(Flood);


});
