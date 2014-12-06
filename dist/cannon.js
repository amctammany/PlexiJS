'use strict';

var config = {
  Canvas: {
    'main': {
      element: 'game-canvas',
      width: 500,
      height: 500
    },
  },
  BodyType: {
    'hero': {
      behaviors: ['Rectangle'],
      width: 25,
      height: 25
    },
    'enemy': {
      behaviors: ['Circle'],
      radius: 15,
    },
  },
};

plexi.load(config);

var hero = plexi.module('BodyType').get('hero');
var enemy = plexi.module('BodyType').get('enemy');
var ctx = plexi.module('Canvas').children()[0].init().ctx;
