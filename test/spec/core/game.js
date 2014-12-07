'use strict';

describe('plexi::Game', function () {
  var Game;

  beforeEach(function () {
    Game = plexi.module('Game');
    plexi.module('BodyType').create('t1', {behaviors: ['Rectangle'], width: 100, height: 100});
    plexi.module('BodyType').create('t2', {behaviors: ['Circle'], radius: 100});

    plexi.module('Canvas').create('main', {element: 'foo', width: 100, height: 100});
    plexi.module('World').create('main', {});
    plexi.module('Stage').create('main', {
      bodies: [
        {type: 't1', x: 10, y: 15, fill: 'blue', stroke: 'black'},
        {type: 't2', x: 20, y: 25, fill: 'blue', stroke: 'black'},
      ]
    });
  });

  it('should be true', function () {
    expect(!!Game).toBe(true);
  });

  it('should create new Game', function () {
    var game = Game.create('game', {defaults: {Canvas: 'main'}});
    expect(!!game).toBe(true);
    expect(game.defaults.Canvas).toBe('main');
  });

  it('should refresh game', function () {
    var game = Game.create('main', {defaults: {Canvas: 'main', World: 'main', Stage: 'main'}});
    plexi.bootstrap('main');
    game.refresh();

  });

});
