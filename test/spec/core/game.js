'use strict';

describe('plexi::Game', function () {
  var Game;

  beforeEach(function () {
    Game = plexi.module('Game');
  });

  it('should be true', function () {
    expect(!!Game).toBe(true);
  });

  it('should create new Game', function () {
    var game = Game.create('game', {});
    expect(!!game).toBe(true);
  });

});
