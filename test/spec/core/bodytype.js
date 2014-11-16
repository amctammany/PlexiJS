'use strict';

describe('plexi::BodyType', function () {
  var BodyType;
  beforeEach(function () {
    BodyType = plexi.module('BodyType');
  });

  it('should be true', function () {
    expect(!!BodyType).toBe(true);
  });

  it('should create new BodyType', function () {
    var body = BodyType.create('name', {
      x: 10, y: 20
    });

    expect(!!body).toBe(true);
  });
});
