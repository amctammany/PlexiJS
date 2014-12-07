'use strict';

describe('plexi::Mouse', function () {
  var Mouse, mouse;
  var config = {
    events: {
      'mousedown': ['World', 'select', '@x', '@y'],
    }
  };

  beforeEach(function () {
    plexi.reset();
    Mouse = plexi.module('Mouse');
    mouse = Mouse.create('mouse', config);
  });

  it('should be true', function () {
    expect(!!Mouse).toBe(true);
  });

  it('should create Mouse', function () {
    expect(!!mouse).toBe(true);
  });
});
