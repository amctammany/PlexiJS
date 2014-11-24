'use strict';

var plexi = (function () {
  var _config; // Holds the current game configuration
  var _constants = {};
  var _modules = {};
  var _behaviors = {};


  var requireModule = function (id) {
    return _modules[id];
  };
  function decorateInstance(i) {
    i.properties = i.properties || [];
    i.constants = i.constants || [];

  }
  function decorateKlass(klass) {
    //if (!i) {return;}
    //klass.properties = i.properties || [];
    //klass.constants = i.constants || [];
    klass.prototype.addProps = addProps;
    klass.prototype.prop = getProp;
  }
  function addProps(arr) {
    arr.forEach(function (p) {
      if (this.properties.indexOf(p) < 0) {
        this.properties.push(p);
      }
    }.bind(this));
  }
  function getProp(body, key) {
    if (body.hasOwnProperty(key)) {
      return body[key];
    } else if (this.hasOwnProperty(key)) {
      return this[key];
    } else if (this.constants.hasOwnProperty(key)) {
      return this.constants[key];
    } else {
      console.log('invalid property name: ' + key + ' called on: ' + body.type);
      return;
    }

  }

  function applyKlassBehaviors(klass, behaviors) {
    if (!klass) {return;}
    var bhvr;
    if (behaviors) {
      behaviors.forEach(function (b) {
        //console.log(b);
        bhvr = plexi.behavior(b);
        //console.log(bhvr);
        if (bhvr) {
          bhvr.applyToKlass(klass);
        }
      });
    }
  }
  function applyInstanceBehaviors(instance, behaviors) {
    if (!instance) {return;}
    var bhvr;
    if (behaviors) {
      behaviors.forEach(function (b) {
        bhvr = plexi.behavior(b);
        if (bhvr) {
          bhvr.applyToInstance(instance);
        }
      });
    }
  }
  function cleanInstance(i) {
    i.ivars = i.properties.filter(function (p) {
      return !i.constants.hasOwnProperty(p);
    });
  }

  var defineMixin = function (mixin) {
    return mixin;

  };

  var defineModule = function (constructor) {
    var module = {
      _current: void 0,
      _children: {},
      get: function (id) {
        return module._children[id];
      },
      create: function (id, config) {
        var Klass = function () {
          constructor.call(this, id, config);
        };
        Klass.prototype = constructor.prototype;
        Klass.prototype.constructor = constructor;
        decorateKlass(Klass);
        applyKlassBehaviors(Klass, config.behaviors);
        var i = new Klass();
        decorateInstance(i);
        applyInstanceBehaviors(i, config.behaviors);
        cleanInstance(i);
        module._children[id] = i;
        //Klass.valid = (Klass.ivars.length > 0) ? false : true;
        return i;
      },
      reset: function () {
        module._children = {};
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
        //console.log(cb);
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
    behavior: function (id, mixin) {
      var Behavior = plexi.module('Behavior');
      //console.log(Behavior);
      if (mixin === void 0) {
        if (_behaviors[id]) {
          return _behaviors[id];
        } else {
          console.warn('Invalid behavior selected: ' + id);
        }
      } else if (typeof mixin === 'function') {
        var behavior = Behavior.create(id, mixin(requireModule, defineMixin));
        behavior.id = id;
        _behaviors[id] = behavior;
        return _behaviors[id];
      } else {
        console.warn('Invalid mixin declared for behavior: ' + id);
      }
      //return plexi.module('Behavior').create(id, mixin(defineMixin));
    },
    load: function (config) {
      if (_config !== config) {
        plexi.reset();
        _config = config;
      }
      Object.keys(_config).forEach(function (key) {
        if (_modules.hasOwnProperty(key)) {
          Object.keys(config[key]).forEach(function (mod) {
            _modules[key].create(mod, config[key][mod]);
          });
        } else {
          _constants[key] = config[key];
        }
      });
    },

    reset: function () {
      plexi.modules().forEach(function (m) {
        m.reset();
      });
    },


  };
})();
