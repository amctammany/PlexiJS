'use strict';

describe('plexi::Behavior::Button', function () {
  var Button, game;

  beforeEach(function () {
    plexi.reset();
    Button = plexi.behavior('Button');

    plexi.module('Canvas').create('main', {element: 'foo', width: 100, height: 100});
    plexi.module('BodyType').create('button', {behaviors: ['Button'], width: 100, height: 100, padding: 10, text: 'Button', textColor: 'blue', action: ['Game.state', 'active']});
    plexi.module('World').create('main', {behaviors: ['WorldSelectable']});
    plexi.module('Mouse').create('main', {
      events: {
        'mousedown': ['World', 'select', '@x', '@y'],
      },
    });
    plexi.module('Stage').create('main', {
      bodies: [
        {type: 'button', x: 10, y: 15, fill: 'blue', textColor: 'black'},
      ]
    });
    game = plexi.module('Game').create('main', {defaults: {Canvas: 'main', World: 'main', Stage: 'main', Mouse: 'main'}, vars: {state: 'paused'}});
    plexi.bootstrap('main');
    //console.log(plexi.current('Stage'));
    game.refresh();

  });

  //it('should be true', function () {
    //expect(!!Button).toBe(true);
  //});

  it('should select button', function () {
    expect(game.getVar('state')).toBe('paused');
    plexi.publish(['Game.state', 'active']);
    expect(game.getVar('state')).toBe('active');
  });


});
