'use strict';

describe('plexi::Stage', function () {
  var Stage;
  var config = {
    bodies: [
      {type: 't1', x: 10, y: 15},
      {type: 't2', x: 20, y: 25},
    ]
  };

  beforeEach(function () {
    plexi.reset();
    plexi.module('BodyType').create('t1', {behaviors: ['Rectangle'], width: 100, height: 100});
    plexi.module('BodyType').create('t2', {behaviors: ['Circle'], radius: 100});
    Stage = plexi.module('Stage');
  });

  it('should be true', function () {
    expect(!!Stage).toBe(true);
  });

  it('should create new Stage', function () {
    var stage = Stage.create('stage', config);
    expect(!!stage).toBe(true);
    expect(stage.valid).toBe(true);
  });

  it('should init Stage', function () {
    var stage = Stage.create('stage', config);
    stage.init();
    expect(stage.bodies.length).toBe(2);
  });
  it('shouldnt init Stage if nothing has changed', function () {
    var stage = Stage.create('stage', config);
    stage.init();
    expect(stage.bodies.length).toBe(2);
    expect(!!stage.init()).toBe(false);
  });

});
