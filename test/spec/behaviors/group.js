'use strict';

describe('plexi::Behavior::Group', function () {
  var Groupe;

  beforeEach(function () {
    Group = plexi.behavior('Group');

  });

  it('should be true', function () {
    expect(!!Group).toBe(true);
  });
});
