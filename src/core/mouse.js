'use strict';

plexi.module('Mouse', function (require, define) {

  function parseEvent (event, vars) {
    return event.map(function (c) {
      if (c[0] === '@') {
        return vars[c.slice(1)];
      } else {
        return c;
      }
    });
  }
  var Mouse = function (id, config) {
    this.id = id;
    this.events = config.events;
  };

  Mouse.prototype.reset = function () {

  };


  Mouse.dispatch = {
    'event': function (e, x, y) {
      var event = this.events[e];
      if (!event) {return false;}
      var vars = {x: x, y: y};
      console.log('event: ' + event);
      if (event) {
        plexi.publish(parseEvent(event, vars));
      }
      return event;

    },
  };

  return define(Mouse);
});
