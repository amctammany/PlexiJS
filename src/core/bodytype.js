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

    var body = {type: this.id};
    Object.keys(config).forEach(function (key) {
      body[key] = config[key];
    });
    if (body.state) {
      this.changeState(body, body.state);
    }

    return body;

  };

  BodyType.prototype.changeState = function (body, state) {
    var s = this.states[state];
    if (s) {
      s.forEach(function (a) {
        body[a[0]] = a[1];
      });
      body.state = state;
    }
  };
  BodyType.prototype.toggleState = function (body, state, def) {
    if (body.state === state) {
      state = def;
    }
    this.changeState(body, state);
  };


  return define(BodyType);
});
