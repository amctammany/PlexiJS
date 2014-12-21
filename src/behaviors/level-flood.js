'use strict';

plexi.behavior('LevelFlood', function (require, define) {
  var _private = {


  };
  var directions = [0, 1, 2, 3];

  var Flood = function () {
    this.addProps(['rows', 'columns']);
    this.rows = this.prop(this, 'rows');
    this.columns = this.prop(this, 'columns');
  };

  Flood.prototype = {
    flood: function (index, acc) {
      var cell = this.bodies[index];
      //console.log(cell);
      var fill = this.prop(cell, 'config').fill;
      //console.log(this.translateCell(index, 0));
      console.log(fill);
      //var next;
      //var flood = directions.reduce(function (prev, current) {
        //next = this.translateCell(prev[prev.length-1], current);
        //if (prev.indexOf(c)) {

        //}
        //console.log(next);
      //}.bind(this), acc);
      cell.fill = 'white';
      //var flood = directions.reduce(function (prev, current) {
        //if (prev.indexOf(current.index)) {
          //return;
        //}
        //return prev.concat(this.flood.call(this, cell.index, flood));

      //}.bind(this), [cell.index]);
      //console.log(flood);

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
    flood: function (index, direction) {
      console.log(this);
      var cell = this.bodies[index];
      console.log(cell);

      return this.flood(cell.index, direction), [cell];
    }.bind(this),
  };

  return define(Flood);


});
