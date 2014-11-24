'use strict';

describe('plexi::Behavior::Rectangle', function () {
  var Rectangle;

  beforeEach(function () {
    Rectangle = plexi.behavior('Rectangle');

  });

  it('should be true', function () {
    expect(!!Rectangle).toBe(true);
  });
});
