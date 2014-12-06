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

  it('should create BodyType with states', function () {
    var readyState = [
          ['fill', 'blue'],
          ['stroke', 'black']
        ];
    var deadState = [
          ['fill', 'black'],
          ['stroke', 'red']
        ];


    var type = BodyType.create('type', {
      states: {
        'ready': readyState,
        'dead': deadState,
      },
    });
    expect(!!type).toBe(true);
    expect(type.statuses).toContain('ready');
    expect(type.statuses).toContain('dead');
    expect(type.states.ready).toBe(readyState);
    expect(type.states.dead).toBe(deadState);
  });
});
