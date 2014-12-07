'use strict';

describe('plexi', function () {
  beforeEach(function () {
    //plexi = plexi.clone();
  });
  it('should be true', function () {
    expect(!!plexi).toBe(true);
  });



  //it('should create dummy module', function () {
    //var module = plexi.module('Mod', function (require, define) {
      //var Instance = function () {};
      //return define(Instance);
    //});
    //expect(!!module).toBe(true);
    //expect(plexi.modules()).toContain(module);
  //});
  //it('should find dummy module', function () {
    //var module = plexi.module('Mod');
    //expect(!!plexi.module('Mod')).toBe(true);
    //expect(plexi.module('Mod')).toBe(module);
  //});

  it('should fail to find non-existent module', function () {
    var mod = plexi.module('foobar');
    expect(!!mod).toBe(false);
  });

  it('should fail to return module without id', function () {
    try {
      plexi.module();
    } catch (e) {
      expect(e).toEqual(Error('Invalid module selection'));
    }
  });

  it('should load configuration', function () {
    var config = {
      BodyType: {
        'hero': {
          behaviors: ['Rectangle'],
          width: 100,
          height: 100,
        },
      },
    };

    plexi.load(config);
    expect(plexi.module('BodyType').length()).toBe(1);
  });

  it('should add to constants if module not found', function () {
    var config = {
      foobar: 125
    };

    plexi.load(config);
    expect(plexi.constants('foobar')).toBe(125);
  });

  it('should refresh configuration if new', function () {
    var config = {
      BodyType: {
        'hero1': {
          behaviors: ['Rectangle'],
          width: 100,
          height: 100,
        },
      },
    };
    plexi.load(config);
    expect(plexi.module('BodyType').length()).toBe(1);
  });

  it('should reset all modules', function () {
    plexi.reset();
    plexi.modules().forEach(function (m) {
      expect(m.length()).toBe(0);
    });
  });

  it('should apply config to object', function () {
    var obj = {id: 'foo', constants: {}};
    var config = {x: 20, y: 30, states: ['ready', 'dead']};
    var priv = {
      states: function (config) {
        this.statuses = config;
      },
    };

    plexi.applyConfig(obj, config, priv);

    expect(obj.constants.x).toBe(20);
    expect(obj.constants.y).toBe(30);
    expect(obj.constants.states).toBe(undefined);
    expect(obj.statuses).toContain('ready');
    expect(obj.statuses).toContain('dead');
  });

  describe('module functionality', function () {

    it('should have base module functionality', function () {
      var module = plexi.module('Canvas');
      expect(typeof module.create).toBe('function');
      expect(typeof module.reset).toBe('function');
      expect(typeof module.children).toBe('function');
      expect(typeof module.length).toBe('function');
      expect(typeof module.get).toBe('function');
      expect(typeof module.change).toBe('function');
      expect(typeof module.dispatch).toBe('function');

    });
  });

  describe('dispatch', function () {
    var dispatchReturn, dispatchReturn1;
    var dispatchFn = function (args) {
      dispatchReturn = args;
    };
    var dispatchFn1 = function (args) {
      dispatchReturn1 = args;
    };


    beforeEach(function () {
      plexi.dispatch.reset();
    });

    it('should subscribe to dispatch', function () {
      expect(plexi.dispatch.length()).toBe(0);
      var token = plexi.subscribe('foobar', dispatchFn);
      expect(!!token).toBe(true);
      expect(plexi.dispatch.length()).toBe(1);
    });

    it('should publish event to channel', function () {
      dispatchReturn = void 0;
      var args = ['hi', 'you', 'guys'];
      plexi.subscribe('foobar', dispatchFn);
      plexi.publish(['foobar'].concat(args));
      expect(dispatchReturn[0]).toBe(args[0]);
      expect(dispatchReturn[1]).toBe(args[1]);
      expect(dispatchReturn[2]).toBe(args[2]);

    });
    it('should unsubscribe to dispatch', function () {
      expect(plexi.dispatch.length()).toBe(0);
      var token = plexi.subscribe('foobar', dispatchFn);
      expect(!!token).toBe(true);
      expect(plexi.dispatch.length()).toBe(1);
      plexi.unsubscribe(token);
      expect(plexi.dispatch.length()).toBe(0);
    });

    it('should publish multiple events', function () {
      dispatchReturn = void 0;
      dispatchReturn1 = void 0;
      plexi.subscribe('f1', dispatchFn);
      plexi.subscribe('f2', dispatchFn1);
      var a1 = ['foo', 'bar'];
      var a2 = ['boo', 'baz'];

      plexi.publish([
        ['f1'].concat(a1),
        ['f2'].concat(a2),
      ]);
      expect(dispatchReturn[0]).toBe(a1[0]);
      expect(dispatchReturn[1]).toBe(a1[1]);
      expect(dispatchReturn1[0]).toBe(a2[0]);
      expect(dispatchReturn1[1]).toBe(a2[1]);
    });




  });

});
