'use strict';

describe('plexi::Level', function () {
  var Level;

  beforeEach(function () {
    plexi.reset();
    Level = plexi.module('Level');
  });

  it('should be true', function () {
    expect(!!Level).toBe(true);
  });

  it('should create level', function () {
    var level = Level.create('one', {bodies: []});
    expect(!!level).toBe(true);
  });
});
