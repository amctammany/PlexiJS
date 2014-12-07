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
        Klass.prototype = Object.create(constructor.prototype);
        Klass.prototype.constructor = constructor;
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
        if (constructor.dispatch.hasOwnProperty(n)) {
          constructor.dispatch[n].apply(module._current, args);
        } else {
          // plexi logging
        }
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


  };
})();

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
  };
  Behavior.prototype.applyToInstance = function (instance) {
    this.constructor.call(instance);
  };

  return define(Behavior);

});

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

'use strict';

plexi.module('Canvas', function (require, define) {
  var _private = {
    drawMethods: {},
  };
  var BodyType = require('BodyType');

  var Canvas = function (id, config) {
    this.id = id;

    this.properties = ['element', 'width', 'height'];
    this.dirty = true;

    this.$canvas = void 0;
    this.ctx = void 0;

    plexi.applyConfig(this, config, _private);
  };


  Canvas.prototype.init = function () {
    if (!this.valid) {console.log('bad canvas'); return false;}
    this.$canvas = document.getElementById(this.constants.element);
    this.$canvas = this.$canvas || document.createElement('canvas');
    this.$canvas.width = this.constants.width;
    this.$canvas.height = this.constants.height;
    this.ctx = this.$canvas.getContext('2d');
    this.width = this.$canvas.width;
    this.height = this.$canvas.height;
    BodyType.children().forEach(function (t) {
      _private.drawMethods[t.id] = t.draw.bind(t);
    });
    this.addEventListeners();
    this.dirty = false;
    return this;

  };

  function getMousePosition(e) {
    return {
      x: e.offsetX,
      y: e.offsetY,
    };
  }
  Canvas.prototype.addEventListeners = function () {

    this.$canvas.onmousedown = function (e) {
      this.focus();
      var pos = getMousePosition(e);
      plexi.publish(['Mouse', 'event', 'mousedown', pos.x, pos.y]);
    };
    this.$canvas.onmouseup = function (e) {
      var pos = getMousePosition(e);
      plexi.publish(['Mouse', 'event', 'mouseup', pos.x, pos.y]);
    };
  };

  Canvas.prototype.draw = function (world) {
    var ctx = this.ctx;
    ctx.clearRect(0, 0, this.constants.width, this.constants.height);
    world.bodies.forEach(function (body) {
      _private.drawMethods[body.type](ctx, body);
    });
  };

  Canvas.prototype.reset = function () {
    this.init();
  };


  return define(Canvas);

});

'use strict';

plexi.module('Game', function (require, define) {
  var _private = {
    defaults: function (config) {
      this.defaults = config;
      return this;
    },

  };
  var _world, _stage, _canvas;

  var Game = function (id, config) {
    this.id = id;
    plexi.applyConfig(this, config, _private);
  };
  var _animLoop, _animFn;
  Game.prototype.start = function () {
    _private.paused = false;
    _animFn = this.animate.bind(this);
    _animFn();
  };
  Game.prototype.animate = function () {
    this.advance(0.03);
    _animLoop = window.requestAnimationFrame(_animFn);
  };
  Game.prototype.advance = function (delta) {
    _canvas.draw(_world);
    //this.current.Canvas.draw(this.current.World);
  };
  Game.prototype.refresh = function () {
    if (_animLoop) {
      window.cancelAnimationFrame(_animLoop);
    }

    var World = require('World');
    var Canvas = require('Canvas');
    var Stage = require('Stage');

    _world = World.current();
    _canvas = Canvas.current();
    _stage = Stage.current();
    _world.load(_stage);
    this.start();
  };

  Game.prototype.reset = function () {
    Object.keys(this.defaults).forEach(function (d) {
      //plexi.publish([d, 'reset']);
    });
    console.log('reset game: ' + this);
  };

  return define(Game);

});

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
      var vars = {x: x, y: y};
      if (event) {
        plexi.publish(parseEvent(event, vars));
      }
      return event;

    },
  };

  return define(Mouse);
});

'use strict';

plexi.module('Stage', function (require, define) {
  var _private = {

  };

  var Level = require('Level');

  var Stage = function (id, config) {
    this.id = id;
    this.config = config;
    plexi.applyConfig(this, config, _private);

    this.dirty = true;
  };

  Stage.prototype.init = function () {
    if (!this.dirty) { return false; }
    this.bodies = this.config.bodies.map(function (b) {
      return {type: b.type, config: b};
    });

    this.dirty = false;

    return this;
  };

  Stage.prototype.loadLevel = function (level) {

  };

  Stage.prototype.reset = function () {
    this.init();

  };

  return define(Stage);
});

'use strict';

plexi.module('World', function (require, define) {
  var BodyType = require('BodyType');
  var Canvas = require('Canvas');
  var _private = {

  };

  var World = function (id, config) {
    this.id = id;
    plexi.applyConfig(this, config, _private);
  };

  World.dispatch = {
    select: function (x, y) {
      var ctx = Canvas.current().ctx;
      var bodies = this.bodies.filter(function (b) {
        return BodyType.get(b.type).isPointInPath(ctx, b, x, y);
      });
      //console.log(bodies);
      var type;
      bodies.forEach(function (b) {
        type = BodyType.get(b.type);
        if (!type.select) { return; }
        type.select(b);

      });
    },

  };

  World.prototype.init = function () {
    this.bodies = [];
    this.forces = [];
    return this;
  };

  World.prototype.addBody = function (type, config) {
    var body = BodyType.get(type).createBody(config);
    this.bodies.push(body);
    return body;
  };

  World.prototype.load = function (obj) {
    obj.bodies.forEach(function (b) {
      this.addBody(b.type, b.config);
    }.bind(this));
  };

  World.prototype.reset = function () {
    this.bodies = [];
    this.forces = [];
  };

  return define(World);


});

'use strict';

plexi.behavior('Circle', function (require, define) {
  var Circle = function () {
    this.addProps(['x', 'y', 'radius']);
  };

  Circle.prototype = {

    draw: function (ctx, body) {
      ctx.fillStyle = this.prop(body, 'fill');
      ctx.strokeStyle = this.prop(body, 'stroke');
      this.createPath(ctx, body);
      ctx.fill();
      ctx.stroke();
    },
    createPath: function (ctx, body) {
      ctx.beginPath();
      ctx.arc(this.prop(body, 'x'), this.prop(body, 'y'), 20, 0, 6.28, 0);
      ctx.closePath();
    },

    isPointInPath: function (ctx, body, x, y) {
      this.createPath(ctx, body);
      return ctx.isPointInPath(x, y);
    },

    //select: function (body) {
      //var state = body.state === 'selected' ? 'default' : 'selected';
      //this.changeState(body, state);
      ////body.fill = 'red';
    //},

  };

  return define(Circle);

});

'use strict';

plexi.behavior('Rectangle', function (require, define) {
  var Rectangle = function () {
    this.addProps(['x', 'y', 'width', 'height']);
  };

  Rectangle.prototype = {
    draw: function (ctx, body) {
      ctx.fillStyle = this.prop(body, 'fill');
      ctx.strokeStyle = this.prop(body, 'stroke');
      this.createPath(ctx, body);
      ctx.fill();
      ctx.stroke();
    },

    createPath: function (ctx, body) {
      ctx.beginPath();
      ctx.rect(this.prop(body, 'x'), this.prop(body, 'y'), this.prop(body, 'width'), this.prop(body, 'height'));
    },

    isPointInPath: function (ctx, body, x, y) {
      this.createPath(ctx, body);
      return ctx.isPointInPath(x, y);
    },

  };

  return define(Rectangle);
});

'use strict';

plexi.behavior('Selectable', function (require, define) {
  var Selectable = function () {
    this.addProps(['selectAction']);
  };

  function applyAction(self, action, body) {
    var fn = action[0];
    if (fn[0] === '@') {
      self[fn.slice(1)].apply(self, [body].concat(action.slice(1)));
    } else {
      plexi.publish(action);
    }

  }

  Selectable.prototype.select = function (body) {
    var action = this.prop(body, 'selectAction');
    var fn = action[0];
    if (fn instanceof Array) {
      action.forEach(function (a) {
        applyAction(this, a, body);
      }.bind(this));
    } else {
      applyAction(this, action, body);
    }
    //plexi.publish(this.prop(body, 'selectAction'));
  };

  return define(Selectable);
});
