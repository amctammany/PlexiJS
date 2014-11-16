'use strict';

var plexi = (function () {
  var _modules = {};


  var requireModule = function (id) {
    return _modules[id];
  };

  var defineModule = function (constructor) {
    var module = {
      _current: void 0,
      _children: {},
      get: function (id) {
        return module._children[id];
      },
      create: function (id, config) {
        return {id: id};
      },
      reset: function () {

      },
      children: function () {
        return Object.keys(module._children).map(function (c) {return module._children[c];});
      },
      length: function () {
        return Object.keys(module._children).length;
      },
      change: function (id) {

      },
      dispatch: function (args) {

      },
    };
    return module;


  };
  return {
    module: function (id, cb) {
      if (id) {
        if (cb && cb instanceof Function) {
          _modules[id] = cb(requireModule, defineModule);
          return _modules[id];
        } else {

          return _modules[id];
        }
      } else {
        throw new Error('Invalid module selection');
      }
    },

    modules: function () {
      return Object.keys(_modules).map(function (m) { return _modules[m];});
    },
  };
})();

'use strict';

plexi.module('BodyType', function (require, define) {
  var BodyType = function (id, config) {
    this.id = id;
  };

  return define(BodyType);
});
