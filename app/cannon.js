'use strict';

var config = {
  Canvas: {
    'main': {
      element: 'game-canvas',
      width: 500,
      height: 500
    },
  },
  World: {
    'main': {

    }
  },
  BodyType: {
    'hero': {
      behaviors: ['Rectangle'],
      width: 25,
      height: 25,
      fill: 'red',
      stroke: 'blue'
    },
    'enemy': {
      behaviors: ['Circle'],
      radius: 15,
      fill: 'green',
      stroke: 'black'
    },
  },
  Stage: {
    'intro': {
      bodies: [
        {type: 'hero', x: 50, y: 50},
        {type: 'enemy', x: 150, y: 150},
        {type: 'hero', x: 250, y: 250},
      ],
    },
  },
  Level: {
    'one': {
      bodies: [
        {type: 'hero', x: 100, y: 100},
        {type: 'enemy', x: 350, y: 200},
        {type: 'hero', x: 250, y: 100},
      ],
    },
  },
  Mouse: {
    'default': {
      events: {
        'mousedown': ['World', 'select', '@x', '@y'],
      }
    },
    'selected': {
      events: {
        'mousedown': ['Mouse', 'change', 'default'],
      },
    },
  },

  Game: {
    'main': {
      defaults: {
        World: 'main',
        Canvas: 'main',
        Stage: 'intro',
        Mouse: 'default',
      },
    },
  },

};

plexi.load(config);
plexi.bootstrap('main');

var hero = plexi.module('BodyType').get('hero');
var enemy = plexi.module('BodyType').get('enemy');
var ctx = plexi.module('Canvas').children()[0].init().ctx;
