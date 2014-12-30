'use strict';

describe('plexi::Behavior::Button', function () {
  var Button;

  beforeEach(function () {
    plexi.reset();
    Button = plexi.behavior('Button');
    plexi.module('BodyType').create('button', {behaviors: ['Button'], width: 100, height: 100, text: 'Button', action: ['Stage', 'change', 'level']});

    plexi.module('Canvas').create('main', {element: 'foo', width: 100, height: 100});
    plexi.module('World').create('main', {});
    plexi.module('Mouse').create('main', {
      events: {
        'mousedown': ['World', 'select', '@x', '@y'],
      },
    });
    plexi.module('Stage').create('main', {
      bodies: [
        {type: 'button', x: 10, y: 15, fill: 'blue', stroke: 'black'},
      ]
    });

  });

  it('should be true', function () {
    expect(!!Button).toBe(true);
  });


});
