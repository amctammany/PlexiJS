'use strict';

describe('plexi::World', function () {
  var World;
  var level = {
    bodies: [
      {type: 't1', config: {x: 10, y: 15}},
      {type: 't2', config: {x: 20, y: 25}},
    ]
  };


  beforeEach(function () {
    plexi.reset();
    World = plexi.module('World');
    plexi.module('BodyType').create('t1', {behaviors: ['Rectangle'], width: 100, height: 100});
    plexi.module('BodyType').create('t2', {behaviors: ['Circle'], radius: 100});
  });

  it('should be true', function () {
    expect(!!World).toBe(true);
  });

  it('should init with bodies and forces', function () {
    var w = World.create('w', {
    });

    w.init();

    expect(!!w.bodies).toBe(true);
    expect(w.bodies.length).toBe(0);
    expect(!!w.forces).toBe(true);
    expect(w.forces.length).toBe(0);
  });

  it('should load level config', function () {
    var w = World.create('w', {});
    w.init();
    expect(w.bodies.length).toBe(0);
    w.load(level);
    expect(w.bodies.length).toBe(2);
  });
  it('should reset level', function () {
    var w = World.create('w', {});
    w.init();
    w.load(level);
    expect(w.bodies.length).toBe(2);
    w.reset();
    expect(w.bodies.length).toBe(0);
  });

});
