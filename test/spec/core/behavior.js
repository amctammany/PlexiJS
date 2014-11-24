'use strict';

describe('plexi::Behavior', function () {
  var Behavior;

  beforeEach(function() {
    Behavior = plexi.module('Behavior');
  });

  it('should be true', function () {
    expect(!!Behavior).toBe(true);
  });
});
