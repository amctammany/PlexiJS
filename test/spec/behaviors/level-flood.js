'use strict';

describe('plexi::Behavior::LevelFlood', function () {
  var LevelFlood;

  beforeEach(function () {
    LevelFlood = plexi.behavior('LevelFlood');

  });

  it('should be true', function () {
    expect(!!LevelFlood).toBe(true);
  });
});
