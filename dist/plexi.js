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
          _modules[id].id = id;
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

    return body;

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
    if (!this.valid) {return false;}
    this.$canvas = document.getElementById(this.constants.element);
    this.$canvas = this.$canvas || document.createElement('canvas');
    this.$canvas.width = this.constants.width;
    this.$canvas.height = this.constants.height;
    this.ctx = this.$canvas.getContext('2d');
    //this.width = this.$canvas.width;
    //this.height = this.$canvas.height;
    BodyType.children().forEach(function (t) {
      _private.drawMethods[t.id] = t.draw.bind(t);
    });
    this.dirty = false;
    return this;

  };
  Canvas.prototype.draw = function (world) {
    var ctx = this.ctx;
    ctx.clearRect(0, 0, this.constants.width, this.constants.height);
    world.bodies.forEach(function (body) {
      _private.drawMethods[body.type](ctx, body);
    });
  };


  return define(Canvas);

});

'use strict';

plexi.module('World', function (require, define) {
  var BodyType = require('BodyType');
  var _private = {

  };

  var World = function (id, config) {
    this.id = id;
    plexi.applyConfig(this, config, _private);
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
      this.addBody(b.type, b);
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

    fireAt: function (x, y) {
      console.log(this.id + ' fired at X: ' + x + '; Y ' + y);
    },

    isPointInPath: function (ctx, body, x, y) {
      this.createPath(ctx, body);
      return ctx.isPointInPath(x, y);
    },

  };

  return define(Rectangle);
});
