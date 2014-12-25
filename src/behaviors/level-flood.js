'use strict';

plexi.behavior('LevelFlood', function (require, define) {
  var _private = {


  };
  var directions = [0, 1, 2, 3];

  var Flood = function () {
    this.addProps(['rows', 'columns', 'types']);
    this.floodSize = this.prop(this, 'size');
    this.floodFound = 0;
  };

  Flood.prototype = {
    flood: function (row, column, fill) {
      //console.log(this.translateCell(index, 0));
      var index = this.getIndex(row, column);
      var cell = this.bodies[index];
      if (cell === null) { return false; }
      var first = false;
      if (fill === -1) {
        first = true;
        fill = cell.fill;
        this.floodSet = new Array(this.floodSize);
        this.floodFound = 0;
      }
      var columns = this.prop(this, 'columns'), rows = this.prop(this, 'rows');
      if (column >= columns || column < 0 || row >= rows || row < 0) {
        return false;
      }
      if (this.floodSet[index] === 1 || (!first && fill !== cell.fill) ) {
        return false;
      }

      //console.log(cell);
      this.floodSet[index] = 1;
      //console.log(this.floodSet);
      this.flood(row, column + 1, fill);
      this.flood(row, column - 1, fill);
      this.flood(row + 1, column, fill);
      this.flood(row - 1, column, fill);

      if (first === true && this.floodFound === 0) {
        return false;
      }
      //console.log(Object.keys(this.floodSet));
      cell.hidden = true;
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
      // Fall down
      var row, column, columns, rows, index, distance, cell;
      for (column = 0, columns = this.prop(this, 'columns'); column < columns; column++ ) {
        distance = 0;
        for (row = this.prop(this, 'rows') - 1; row >= 0; row--) {
          index = this.getIndex(row, column);
          if (this.bodies[index] === null) {
            distance += 1;
          } else {
            if (distance > 0) {
              cell = this.bodies[index];
              //console.log(cell);
              if (cell.hidden) {return;}
              cell.row += distance;
              cell.y += cell.height * distance;
              this.bodies[this.getIndex(row + distance, column)] = cell;
              this.bodies[this.getIndex(row, column)] = null;
            }
          }
        }
      }
      // Fall Left
      distance = 0;
      for (column = 0, columns = this.prop(this, 'columns'); column < columns; column++ ) {
        if (this.bodies[this.getIndex(this.prop(this, 'rows') - 1, column)] === null) {
          distance += 1;
        } else {
          if (distance > 0) {
            for (row = 0, rows = this.prop(this, 'rows'); row < rows; row++) {
              index = this.getIndex(row, column);
              cell = this.bodies[index];
              if (cell === null) { continue; }
              cell.column -= distance;
              cell.x -= cell.width * distance;
              this.bodies[this.getIndex(row, column - distance)] = cell;
              this.bodies[this.getIndex(row, column)] = null;
            }
          }
        }
      }
    },

  };

  Flood.dispatch = {
    flood: function (row, column) {
      //console.log(this);
      //var index = this.getIndex(row, column);
      //console.log(index);
      //var cell = this.bodies[this.getIndex(row, column)];

      this.flood(row, column, -1);//, [cell];
      //console.log(this.floodFound);
      plexi.publish(['Game.score', '+', (this.floodFound - 1) * (this.floodFound - 1)]);
      this.shuffleDown();
    },
  };

  return define(Flood);


});
