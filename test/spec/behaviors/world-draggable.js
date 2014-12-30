'use strict';

describe('plexi::Behavior::WorldDraggable', function () {
  var WorldDraggable;

  beforeEach(function () {
    WorldDraggable = plexi.behavior('WorldDraggable');

  });

  it('should be true', function () {
    expect(!!WorldDraggable).toBe(true);
  });
});
