'use strict';

var config = {
  Canvas: {
    'main': {
      element: 'game-canvas',
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
