'use strict';

describe('plexi::Behavior::WorldSelectable', function () {
  var WorldSelectable;

  beforeEach(function () {
    WorldSelectable = plexi.behavior('WorldSelectable');

  });

  it('should be true', function () {
    expect(!!WorldSelectable).toBe(true);
  });
});
