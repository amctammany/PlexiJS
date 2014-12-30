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
    if (!this.valid) {console.log('bad canvas. Missing: ['+this.ivars); return false;}
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
      //this.focus();
      var pos = getMousePosition(e);
      plexi.publish(['Mouse', 'event', 'mousedown', pos.x, pos.y]);
    };
    this.$canvas.onmouseup = function (e) {
      var pos = getMousePosition(e);
      plexi.publish(['Mouse', 'event', 'mouseup', pos.x, pos.y]);
    };
    this.$canvas.onmousemove = function (e) {
      var pos = getMousePosition(e);
      plexi.publish(['Mouse', 'event', 'mousemove', pos.x, pos.y]);
    };

  };

  Canvas.prototype.draw = function (world) {
    var ctx = this.ctx;
    ctx.clearRect(0, 0, this.constants.width, this.constants.height);
    world.bodies.forEach(function (body) {
      if (body.hidden) {return;}
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
    vars: function (names) {
      if (!names) { return false; }
      this.vars = {};
      this.defVars = names;
      var name;
      Object.keys(names).forEach(function (n) {
        name = 'Game.'+n;
        plexi.subscribe(name, this.updateVar(n));
        this.vars[n] = names[n];
      }.bind(this));
    },

  };
  var _world, _stage, _canvas;

  var Game = function (id, config) {
    this.id = id;
    plexi.applyConfig(this, config, _private);
  };
  Game.prototype.updateVar = function (n) {
    return function (newValue) {
      if (newValue === undefined) {
        return 'undefined';
      }
      if (newValue[0] === '+') {
        console.log('incrementing game varible: ' + n);
        this.vars[n] += newValue[1];
        console.log(this.vars[n]);
      } else {
        console.log('updating game variable: ' + n);
        this.vars[n] = newValue[0];
      }
      return this.vars[n];
    }.bind(this);
  };
  var _animLoop, _animFn;
  Game.prototype.start = function () {
    if (!!this.vars) {

    Object.keys(this.vars).forEach(function(n) {
      this.vars[n] = this.defVars[n];
    }.bind(this));
    }
    //this.vars.forEach(function (n) {
      //plexi.publish(['Game.'+n, this[n]]);
    //}.bind(this));
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

  Game.prototype.getVar = function (key) {
    return this[key];
  };

  Game.dispatch = {
    refresh: function () {
      this.refresh();
    },
  };
  return define(Game);

});

'use strict';

plexi.module('Level', function (require, define) {
  var _private = {

  };


  var Level = function (id, config) {
    this.id = id;
    this.config = config;
    this.bodies = [];
    this.dirty = true;
    this.loaded = false;
    plexi.applyConfig(this, config, _private);
  };

  Level.prototype.init = function () {
    //if (!this.dirty) {return false;}
    console.log('regular init');
    this.bodies = this.config.bodies.map(function (body) {
      return {type: body.type, config: body};
    });
    this.loaded = false;
    return this;
  };

  Level.prototype.reset = function () {
    //this.init();
    this.dirty = false;
  };

  Level.dispatch = {
    change: function (id) {
      console.log('changed level');
      this.reset();
      plexi.publish(['Stage', 'loadLevel', id]);
    },
    flush: function (index) {
      console.log(index);
    },
  };

  return define(Level);

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
  var World = require('World');

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

  Stage.prototype.loadLevel = function (id) {
    var level = Level.get(id);
    console.log(level);
    level.dirty = true;
    level.init();
    require('World').current().load(level);

  };

  Stage.prototype.reset = function () {
    this.dirty = true;
    this.init();

  };

  Stage.dispatch = {
    'change': function (args) {
      this.reset();
      plexi.publish([['World', 'reset'], ['Game', 'refresh']]);
    },
    loadLevel: function (id) {
      this.reset();
      this.loadLevel(id);
    }

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

  World.createBody = function createBody (type, config) {
    var bodytype = BodyType.get(type);
    if (!config) {
      console.log('Invalid Configuration for BodyType: ' + type);
      return;
    }
    var body = bodytype.createBody(config);
    return body;
  };
  World.prototype.init = function () {
    this.reset();
    return this;
  };
  World.prototype.removeBody = function (body) {
    var index = this.bodies.indexOf(body);
  };

  World.prototype.addBody = function (type, config) {
    var bodytype = BodyType.get(type);
    if (!config) {
      console.log('Invalid Configuration for BodyType: ' + type + '; config ' + config);
      return;
    }
    var body = bodytype.createBody(config);
    this.bodies.push(body);
    body.index = this.bodies.length - 1;
    if (bodytype.init) {
      bodytype.init(body);
      if (body.members) {
        body.members.forEach(function (m) {
          //console.log(m);
          this.bodies.push(m);
        }.bind(this));
      }
    }

    return body;
  };

  World.prototype.load = function (obj) {

    //if (obj.loaded) { return false; }
    obj.bodies = obj.bodies.map(function (b) {
      return this.addBody(b.type, b.config);
    }.bind(this));
    if (obj.hasOwnProperty('loaded')) {obj.loaded = true;}
  };

  World.prototype.reset = function () {
    this.bodies = [];
    this.forces = [];
    this.selection = [];
    this.dragStart = {x: 0, y: 0};
  };

  //World.prototype.select = function (x, y) {
    //var ctx = Canvas.current().ctx;
    //var bodies = this.bodies.filter(function (b) {
      //return BodyType.get(b.type).isPointInPath(ctx, b, x, y);
    //});
    //this.selection = bodies;
    //var type;
    //bodies.forEach(function (b) {
      //type = BodyType.get(b.type);
      //if (!type.select) { return; }
      //type.select(b);
    //});
  //};
  //World.prototype.unselect = function () {
    //var type;
    //this.selection.forEach(function (b) {
      //type = BodyType.get(b.type);
      //if (!type.select) { return; }
      //type.select(b);
    //});
  //};
  //World.prototype.dragSelection = function (x, y) {
    //var dx = this.dragStart.x - x;
    //var dy = this.dragStart.y - y;
    //this.dragStart = {x: x, y: y};
    //var type;
    //this.selection.forEach(function (b) {
      //b.x -= dx;
      //b.y -= dy;
    //});
  //};

  World.dispatch = {
    //select: function (x, y) {
      //this.select(x, y);
    //},
    //unselect: function () {
      //this.unselect();
    //},
    //drag: function (x, y) {
      //console.log(Array.prototype.slice.call(arguments));
      //this.dragSelection(x, y);
    //},

    createBody: function (type, config) {
      return createBody(type, config);
    },
    reset: function () {
      this.reset();
    },

  };

  return define(World);


});

'use strict';

plexi.behavior('Button', function (require, define) {
  var Button = function () {
    this.addProps(['x', 'y', 'width', 'text', 'action', 'fill', 'textColor', 'padding']);
  };

  Button.prototype = {
    draw: function (ctx, body) {
      ctx.fillStyle = this.prop(body, 'fill');
      this.createPath(ctx, body);
      ctx.fill();
      ctx.fillStyle = this.prop(body, 'textColor');
      this.drawText(ctx, body);
      ctx.fill();
    },

    drawText: function (ctx, body) {
      var padding = this.prop(body, 'padding');
      var text = this.prop(body, 'text');
      var w = this.prop(body, 'width');
      var h = this.prop(body, 'height');
      var x = this.prop(body, 'x');
      var y = this.prop(body, 'y');
      ctx.font = '20px Arial';
      var width = ctx.measureText(text).width;
      ctx.beginPath();
      ctx.fillText(text, x + (padding + w - width) / 2, y + 10 + h / 2);
      ctx.closePath();

    },

    createPath: function (ctx, body) {
      var padding = this.prop(body, 'padding');
      ctx.font = '20px Arial';
      var width = this.prop(body, 'width') || ctx.measureText(this.prop(body, 'text')).width;
      var height = this.prop(body, 'height') || 20;
      ctx.beginPath();
      ctx.rect(this.prop(body, 'x'), this.prop(body, 'y'), width + padding, height + padding);
      ctx.closePath();
      //ctx.text(body.x + (width / 2), body.y, this.prop('text'));
    },

    isPointInPath: function (ctx, body, x, y) {
      this.createPath(ctx, body);
      return ctx.isPointInPath(x, y);
    },

    select: function (body) {
      plexi.publish(this.prop(body, 'action'));
    },

  };

  return define(Button);
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

plexi.behavior('Group', function (require, define) {

  var Group = function () {
    this.addProps(['template', 'group', 'rows', 'columns', 'x', 'y', 'width', 'height', 'padding']);

  };

  Group.prototype = {
    init: function (body) {
      var prop = function (key) {return this.prop(body, key);}.bind(this);
      body.fill = prop('fills')[Math.floor(Math.random() * prop('fills').length)];
      body.itemWidth = (prop('width') - (prop('padding') * (prop('columns') + 1))) / prop('columns');
      body.itemHeight = (prop('height') - (prop('padding') * (prop('rows') + 1))) / prop('rows');
      body.tId = prop('template');
      var template = require('BodyType').get(body.tId);
      var group = prop('group');
      body.members = group.map(function (item) {
        var i = group.indexOf(item);
        var row = Math.floor(i / prop('columns'));
        var column = i % prop('columns');
        item.x = prop('x') + prop('padding') + (prop('padding') + body.itemWidth) * column;
        item.y = prop('y') + prop('padding') + (prop('padding') + body.itemHeight) * row;
        item.width = body.itemWidth - prop('padding');
        item.height = body.itemHeight - prop('padding');
        var b = template.createBody(item);
        return b;
      });
      body.initialized = true;

    },
    draw: function (ctx, body) {
      if (!body.initialized) {this.init(body);}
      var template = plexi.module('BodyType').get(body.tId);
      ctx.fillStyle = 'black';
      ctx.fillRect(this.prop(body, 'x'), this.prop(body, 'y'), this.prop(body, 'width'), this.prop(body, 'height'));
      //body.members.forEach(function (b) {
        //template.draw(ctx, b);
      //});
    },

    createPath: function (ctx, body) {
      var prop = function (key) {return this.prop(body, key);}.bind(this);
      if (!body.initialized) {this.init(body);}
      ctx.beginPath();
      ctx.rect(prop('x'), prop('y'), prop('width'), prop('height'));
      ctx.closePath();
    },

    isPointInPath: function (ctx, body, x, y) {
      this.createPath(ctx, body);
      return ctx.isPointInPath(x, y);
    },

  };

  return define(Group);

});

'use strict';

plexi.behavior('Label', function (require, define) {
  var Label = function () {
    this.addProps(['x', 'y', 'width', 'text', 'textColor', 'padding']);
  };

  Label.prototype = {
    draw: function (ctx, body) {
      var padding = this.prop(body, 'padding');
      var text = this.prop(body, 'text');
      var w = this.prop(body, 'width');
      var h = this.prop(body, 'height');
      var x = this.prop(body, 'x');
      var y = this.prop(body, 'y');

      this.createPath(ctx, body);
      ctx.font = '20px Arial';
      var width = ctx.measureText(text).width;
      ctx.beginPath();
      ctx.fillText(text, x + (padding + w - width) /2, y + 10 + h / 2 );
    },
    createPath: function (ctx, body) {
      var padding = this.prop(body, 'padding');
      ctx.font = '20px Arial';
      var width = this.prop(body, 'width') || ctx.measureText(this.prop(body, 'text')).width;
      var height = this.prop(body, 'height') || 20;
      ctx.beginPath();
      ctx.rect(this.prop(body, 'x'), this.prop(body, 'y'), width + padding, height + padding);
      ctx.closePath();

    },
    isPointInPath: function (ctx, body, x, y) {
      this.createPath(ctx, body);
      return ctx.isPointInPath(x, y);
    },

  };

  return define(Label);
});

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

'use strict';

plexi.behavior('LevelTiled', function (require, define) {
  var World = require('World');

  var Tiled = function () {
    this.addProps(['rows', 'columns', 'template']);
    this.size = this.prop(this, 'rows') * this.prop(this, 'columns');
    this.cells = Array.apply(0, new Array(this.size)).map(function () {return {};});
  };
  Tiled.prototype = {
    init: function () {
      if (!this.dirty) { return false; }
      console.log('init level')
      var prop = function (key) {return this.prop(this, key);}.bind(this);
      var type = require('BodyType').get(prop('template').id);
      var tileWidth = prop('width') / prop('columns');
      var tileHeight = prop('height') / prop('rows');

      var pos;
      var rows = prop('rows'), columns = prop('columns');
      var x = prop('x'), y = prop('y');
      this.bodies = this.cells.map(function (cell, index) {
        pos = plexi.getGridPosition(index, rows, columns);
        var row = pos.row, column = pos.column;
        return {type: type.id,  config: {x: x + (column * tileWidth), y: y + (row * tileHeight), fill: prop('template').fill(), index: index, row: row, column: column, width: tileWidth, height: tileHeight }};
      });

    },
    getIndex: function (row, column) {
      var columns = this.prop(this, 'columns');
      return (row * columns) + column;

    },
  };

    return define(Tiled);

});

'use strict';

plexi.behavior('Outlet', function (require, define) {

  var Outlet = function () {
    this.addProps(['channel', 'defaultText']);
  };

  Outlet.prototype = {
    init: function (body) {
      //console.log('init outlet');
      //console.log(body);
      plexi.observe(this.prop(body, 'channel'), this.refresh(body));
      body.text = body.defaultText;
    },
    refresh: function (body) {
      return function (newValue) {
        body.text = newValue;
      };
    },
    draw: function (ctx, body) {
      var text = (this.prop(body, 'text')) ||  this.prop(body, 'defaultText');
      var padding = this.prop(body, 'padding');
      var w = this.prop(body, 'width');
      var h = this.prop(body, 'height');
      var x = this.prop(body, 'x');
      var y = this.prop(body, 'y');

      this.createPath(ctx, body);
      ctx.font = '20px Arial';
      var width = ctx.measureText(text).width;
      ctx.beginPath();
      ctx.fillText(text, x + (padding + w - width) /2, y + 10 + h / 2 );

    },

  };

  return define(Outlet);
});

'use strict';

plexi.behavior('Rectangle', function (require, define) {
  var Rectangle = function () {
    this.addProps(['x', 'y', 'width', 'height']);
    this.opacity = 1;
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
      if (body.hidden) {return false;}
      this.createPath(ctx, body);
      return ctx.isPointInPath(x, y);
    },

  };

  return define(Rectangle);
});

'use strict';

plexi.behavior('RandomGroup', function (require, define) {

  var RandomGroup = function () {
    this.addProps(['template', 'rows', 'columns', 'x', 'y', 'width', 'height', 'padding']);

  };

  RandomGroup.prototype = {
    init: function (body) {
      var prop = function (key) {return this.prop(body, key);}.bind(this);
      body.itemWidth = (prop('width') - (prop('padding') * (prop('columns') + 1))) / prop('columns');
      body.itemHeight = (prop('height') - (prop('padding') * (prop('rows') + 1))) / prop('rows');
      body.tId = prop('template');
      var template = require('BodyType').get(body.tId);
      var RandomGroup = Array.apply(0, new Array(prop('columns') * prop('rows'))).map(function () { return {};});
      body.members = RandomGroup.map(function (item) {
        var i = RandomGroup.indexOf(item);
        var row = Math.floor(i / prop('columns'));
        var column = i % prop('columns');
        item.fill = prop('fills')[Math.floor(Math.random() * prop('fills').length)];
        item.x = prop('x') + prop('padding') + (prop('padding') + body.itemWidth) * column;
        item.y = prop('y') + prop('padding') + (prop('padding') + body.itemHeight) * row;
        item.width = body.itemWidth - prop('padding');
        item.height = body.itemHeight - prop('padding');
        var b = template.createBody(item);
        return b;
      }.bind(this));
      body.initialized = true;

    },
    draw: function (ctx, body) {
      if (!body.initialized) {this.init(body);}
      var template = plexi.module('BodyType').get(body.tId);
      ctx.fillStyle = 'black';
      ctx.fillRect(this.prop(body, 'x'), this.prop(body, 'y'), this.prop(body, 'width'), this.prop(body, 'height'));
      //body.members.forEach(function (b) {
        //template.draw(ctx, b);
      //});
    },

    createPath: function (ctx, body) {
      var prop = function (key) {return this.prop(body, key);}.bind(this);
      if (!body.initialized) {this.init(body);}
      ctx.beginPath();
      ctx.rect(prop('x'), prop('y'), prop('width'), prop('height'));
      ctx.closePath();
    },

    isPointInPath: function (ctx, body, x, y) {
      this.createPath(ctx, body);
      return ctx.isPointInPath(x, y);
    },

  };

  return define(RandomGroup);

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
      plexi.publish(action.map(function (a) {
        return a[0] === '@' ? body[a.slice(1)] : a;
      }));
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

'use strict'

plexi.behavior('WorldDraggable', function (require, define) {
  var Draggable = function () {
    this.selection = [];
    this.dragStart = {};
  };
  var Canvas = require('Canvas');
  var BodyType = require('BodyType');
  Draggable.prototype.select = function (x, y) {
    this.dragStart.x = x;
    this.dragStart.y = y;
    var ctx = Canvas.current().ctx;
    var bodies = this.bodies.filter(function (b) {
      return BodyType.get(b.type).isPointInPath(ctx, b, x, y);
    });
    this.selection = bodies;
    var type;
    bodies.forEach(function (b) {
      type = BodyType.get(b.type);
      if (!type.select) { return; }
      type.select(b);
    });
  };
  Draggable.prototype.unselect = function () {
    var type;
    this.selection.forEach(function (b) {
      type = BodyType.get(b.type);
      if (!type.select) { return; }
      type.select(b);
    });
  };
  Draggable.prototype.dragSelection = function (x, y) {
    console.log('drag from behavior');
    var dx = this.dragStart.x - x;
    var dy = this.dragStart.y - y;
    this.dragStart = {x: x, y: y};
    var type;
    this.selection.forEach(function (b) {
      b.x -= dx;
      b.y -= dy;
    });
  };

  Draggable.dispatch = {
    drag: function (x, y) {
      console.log(Array.prototype.slice.call(arguments));
      this.dragSelection(x, y);
    },
  };

  return define(Draggable);
});

'use strict'

plexi.behavior('WorldSelectable', function (require, define) {
  var Selectable = function () {
    this.selection = [];
  };
  var Canvas = require('Canvas');
  var BodyType = require('BodyType');
  Selectable.prototype.select = function (x, y) {
    this.dragStart.x = x;
    this.dragStart.y = y;
    var ctx = Canvas.current().ctx;
    var bodies = this.bodies.filter(function (b) {
      return BodyType.get(b.type).isPointInPath(ctx, b, x, y);
    });
    this.selection = bodies;
    var type;
    bodies.forEach(function (b) {
      type = BodyType.get(b.type);
      if (!type.select) { return; }
      type.select(b);
    });
    return bodies;
  };
  Selectable.prototype.unselect = function () {
    var type;
    this.selection.forEach(function (b) {
      type = BodyType.get(b.type);
      if (!type.select) { return; }
      type.select(b);
    });
  };

  Selectable.dispatch = {
    select: function (x, y) {
      return this.select(x, y);
    },
    unselect: function () {
      this.unselect();
    },
  };

  return define(Selectable);
});
