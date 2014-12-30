'use strict';

describe('plexi::Behavior::RandomGroup', function () {
  var RandomGroup;

  beforeEach(function () {
    RandomGroup = plexi.behavior('RandomGroup');

  });

  it('should be true', function () {
    expect(!!RandomGroup).toBe(true);
  });
});
