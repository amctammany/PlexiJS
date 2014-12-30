'use strict';

describe('plexi::Behavior::Outlet', function () {
  var Outlet;

  beforeEach(function () {
    Outlet = plexi.behavior('Outlet');

  });

  it('should be true', function () {
    expect(!!Outlet).toBe(true);
  });
});
