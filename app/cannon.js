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
  },
};

plexi.load(config);
