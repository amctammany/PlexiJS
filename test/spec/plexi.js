'use strict';

describe('plexi', function () {
  beforeEach(function () {
    //plexi = plexi.clone();
  });
  it('should be true', function () {
    expect(!!plexi).toBe(true);
  });



  it('should create dummy module', function () {
    var module = plexi.module('Mod', function (require, define) {
      var Instance = function () {};
      return define(Instance);
    });
    expect(!!module).toBe(true);
    expect(plexi.modules()).toContain(module);
  });
  it('should find dummy module', function () {
    var module = plexi.module('Mod');
    expect(!!plexi.module('Mod')).toBe(true);
    expect(plexi.module('Mod')).toBe(module);
  });

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

  describe('module functionality', function () {

    it('should have base module functionality', function () {
      var module = plexi.module('Mod');
      expect(typeof module.create).toBe('function');
      expect(typeof module.reset).toBe('function');
      expect(typeof module.children).toBe('function');
      expect(typeof module.length).toBe('function');
      expect(typeof module.get).toBe('function');
      expect(typeof module.change).toBe('function');
      expect(typeof module.dispatch).toBe('function');

    });
  });

});
