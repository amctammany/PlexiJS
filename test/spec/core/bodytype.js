'use strict';

describe('plexi::BodyType', function () {
  var BodyType;
  beforeEach(function () {
    plexi.reset();
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

  it('should create body', function () {
    var type = BodyType.create('type', {
      behaviors: ['Rectangle'],
      width: 100,
      height: 100,
    });

    var body = type.createBody({
      x: 10,
      y: 20
    });

    expect(!!body).toBe(true);
    expect(body.type).toBe('type');
    expect(body.x).toBe(10);
    expect(body.y).toBe(20);

  });


});
