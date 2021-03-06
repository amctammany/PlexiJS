'use strict';

var plexi = (function () {
  var _config; // Holds the current game configuration
  var _constants = {};
  var _modules = {};
  var _behaviors = {};
  var _dispatch = {};


  var requireModule = function (id) {
    return _modules[id];
  };
  function decorateInstance(i) {
    i.properties = i.properties || [];
    i.constants = i.constants || [];

  }
  function decorateKlass(klass) {
    //if (!i) {return;}
    klass.properties = klass.properties || [];
    klass.constants = klass.constants || [];
    klass.prototype.addProps = addProps;
    klass.prototype.prop = getProp;
    //klass.dispatch = klass.dispatch || {};
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
    i.valid = (i.ivars.length > 0) ? false : true;
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
        Klass.id = id;
        Klass.prototype = Object.create(constructor.prototype);
        Klass.prototype.constructor = constructor;
        //console.log(Object.keys(constructor))
        //Object.keys(constructor).forEach(function (k) {
          //Klass[k] = constructor[k];
        //});
        Klass.prototype.dispatch = Object.create(constructor.dispatch || {});
        decorateKlass(Klass);
        applyKlassBehaviors(Klass, config.behaviors);
        var i = new Klass();
        decorateInstance(i);
        applyInstanceBehaviors(i, config.behaviors);
        cleanInstance(i);
        module._children[id] = i;
        return i;
      },
      reset: function () {
        module._children = {};
        module._current = void 0;
      },
      children: function () {
        return Object.keys(module._children).map(function (c) {return module._children[c];});
      },
      length: function () {
        return Object.keys(module._children).length;
      },
      change: function (id) {
        if (!module._children.hasOwnProperty(id)) { return; }
        module._current = module._children[id];
        return module._current;
      },
      current: function () {
        return module._current;
      },
      dispatch: function (args) {
        var n = args.shift();
        if (n === 'change') {
          module.change(args[0]);
        }
        var current = module.current();
        //console.log(module._current.dispatch[n]);
        if (current.dispatch[n]) {
          //console.log(n);
          current.dispatch[n].apply(current, args);
        } else {
          // plexi logging
        }
        //if (constructor.dispatch.hasOwnProperty(n)) {
          //console.log(n);
          //constructor.dispatch[n].apply(module._current, args);
        //} else {
          //// plexi logging
        //}
      },
    };
    return module;


  };
  return {
    module: function (id, cb) {
      if (id) {
        //console.log(cb);
        if (cb && cb instanceof Function) {
          var module = cb(requireModule, defineModule);
          module.id = id;
          module.token = _dispatch.subscribe(id, module.dispatch);
          _modules[id] = module;
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
    current: function (module) {
      return _modules[module].current();
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
    dispatch: (function (obj) {
      var channels = {};
      var uid = -1;

      obj.publish = function (args) {
        args = args.slice();
        var channel = args.shift();
        if (!channels[channel]) {
          return false;
        }
        var subscribers = channels[channel],
            l = subscribers ? subscribers.length : 0;
        while(l--) {
          subscribers[l].func(args);
        }
      };

      obj.subscribe = function (channel, func) {
        if (!channels[channel]) {
          channels[channel] = [];
        }
        var token = (++uid).toString();
        channels[channel].push({
          token: token,
          func: func,
        });
        return token;
      };

      obj.unsubscribe = function (token) {
        for (var c in channels) {
          if (channels[c]) {
            for (var i = 0, j = channels[c].length; i < j; i++){
              if (channels[c][i].token === token) {
                channels[c].splice(i, 1);
            if (channels[c].length === 0) {
              delete channels[c];
            }

                return token;
              }
            }
          }
        }
        //return this;
      };

      obj.reset = function () {
        channels = {};
        uid = -1;
      };

      obj.length = function () {
        return Object.keys(channels).length;
      };
      return obj;
    })(_dispatch),

    publish: function (args) {
      if (args[0] instanceof Array) {
        args.forEach(function (a) {
          plexi.dispatch.publish(a);
        });
      } else {
        return plexi.dispatch.publish(args);
      }
    },
    subscribe: function (channel, func) {
      return plexi.dispatch.subscribe(channel, func);
    },
    unsubscribe: function (token) {
      return plexi.dispatch.unsubscribe(token);
    },
    observe: function (channel, func) {
      var c = channel.split('.');
      var vars = plexi.current(c[0]).vars;
      var name = c[1];
      Object.observe(vars, function(changes) {
        changes.forEach(function(change) {
          if (change.name === name) {
            func(vars[name]);
          }
        });

      });
    },

    load: function (config) {
      if (_config !== config) {
        plexi.reset();
        _config = config;
        _constants = {};
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
    constants: function (key) {
      return _constants[key];
    },

    applyConfig: function (obj, config, priv) {
      obj.constants = obj.constants || {};
      Object.keys(config).forEach(function (key) {
        if (priv.hasOwnProperty(key) && priv[key] instanceof Function) {
          priv[key].call(obj, config[key]);
        } else {
          obj.constants[key] = config[key];
        }
      });
    },

    reset: function () {
      plexi.modules().forEach(function (m) {
        m.reset();
      });
    },
    bootstrap: function (id) {
      var game = plexi.module('Game').change(id);
      ['Canvas', 'World', 'Stage', 'Mouse'].forEach(function (s) {
        var module = plexi.module(s);
        module.change(game.defaults[s]).reset();
      });

      game.refresh();
      //console.log(game);

    },

    random: function (opts) {
      var l = opts.length;
      return function () {
        return opts[Math.floor((Math.random() * l))];
      };
    },
    getGridPosition: function (index, rows, columns) {
      var col = index % columns;
      var row = Math.floor(index / columns);
      return {row: row, column: col};
    },
  };
})();
