'use strict';

plexi.module('Behavior', function (require, define) {
  var Behavior = function (id, constructor) {
    this.id = id;
    this.constructor = constructor;
    this.properties = [];
  };

  Behavior.prototype.applyToKlass = function (klass) {
    Object.keys(this.constructor.prototype).forEach(function (k) {
      klass.prototype[k] = this.constructor.prototype[k];
    }.bind(this));

    if (this.constructor.hasOwnProperty('dispatch')) {
      Object.keys(this.constructor.dispatch).forEach(function (k) {
        klass.prototype.dispatch[k] = this.constructor.dispatch[k];
      }.bind(this));
    }
  };
  Behavior.prototype.applyToInstance = function (instance) {
    this.constructor.call(instance);
  };

  return define(Behavior);

});
