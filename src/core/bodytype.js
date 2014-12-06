'use strict';

plexi.module('BodyType', function (require, define) {
  var _private = {
    /**
     * @function
     * @param {Object} config Configuration Object
     * @memberof BodyType
     */
    states: function (config) {
      this.statuses = Object.keys(config);
      this.states = config;

      //console.log(config);
    },

  };

  var BodyType = function (id, config) {
    this.id = id;
    plexi.applyConfig(this, config, _private);

  };

  BodyType.prototype.createBody = function (config) {

    var body = {bodytype: this.id};
    Object.keys(config).forEach(function (key) {
      body[key] = config[key];
    });

    return body;

  };

  return define(BodyType);
});
