'use strict';

describe('plexi::Behavior::Circle', function () {
  var Circle;

  beforeEach(function () {
    Circle = plexi.behavior('Circle');

  });

  it('should be true', function () {
    expect(!!Circle).toBe(true);
  });
});
