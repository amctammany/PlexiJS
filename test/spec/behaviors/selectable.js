'use strict';

describe('plexi::Behavior::Selectable', function () {
  var Selectable;

  beforeEach(function () {
    Selectable = plexi.behavior('Selectable');

  });

  it('should be true', function () {
    expect(!!Selectable).toBe(true);
  });
});
