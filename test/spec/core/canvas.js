'use strict';

describe('plexi::Canvas', function () {
  var Canvas;
  var config = {
    element: 'foo',
    width: 600,
    height: 400,
  };

  beforeEach(function () {
    plexi.reset();
    Canvas = plexi.module('Canvas');
  });

  it('should be true', function () {
    expect(!!Canvas).toBe(true);
  });

  it('should create new Canvas', function () {
    var canvas = Canvas.create('canvas', config);
    expect(!!canvas).toBe(true);
    expect(canvas.valid).toBe(true);
  });

  it('should create new Canvas without all required props', function () {
    var canvas = Canvas.create('canvas', {element: 'foobar'});
    expect(!!canvas).toBe(true);
    expect(canvas.valid).toBe(false);
  });

  it('should init canvas', function () {
    var canvas = Canvas.create('canvas', config);
    expect(canvas.dirty).toBe(true);
    expect(!!canvas.init()).toBe(true);
    expect(canvas.dirty).toBe(false);
  });

  it('should fail to init with all properties', function () {
    var canvas = Canvas.create('canvas', {element: 'foobar'});
    expect(!!canvas.init()).toBe(false);
  });

});
