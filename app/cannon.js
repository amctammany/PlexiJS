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
    'button': {
      behaviors: ['Button'],
      fill: 'green',
      textColor: 'red',
      padding: 5,
    },
    'hero': {
      behaviors: ['Rectangle', 'Selectable'],
      width: 25,
      height: 25,
      fill: 'red',
      stroke: 'blue',
      selectAction: [['@toggleState', 'selected', 'ready'], ['Mouse', 'change', 'selected']],
      states: {
        'ready': [
          ['fill', 'red'],
          ['stroke', 'blue']
        ],
        'selected': [
          ['fill', 'blue'],
          ['stroke', 'red']
        ]
      }
    },
    'enemy': {
      behaviors: ['Circle', 'Selectable'],
      radius: 15,
      fill: 'green',
      stroke: 'black',
      selectAction: ['@toggleState', 'selected', 'ready'],
      states: {
        'ready': [
          ['fill', 'green'],
          ['stroke', 'black']
        ],
        'selected': [
          ['fill', 'black'],
          ['stroke', 'green']
        ]
      }

    },
  },
  Stage: {
    'intro': {
      bodies: [
        {type: 'button', x: 5, y: 5, width: 100, height: 25, text: 'Level One', action: [['Stage', 'change', 'level'], ['Level', 'change', 'one']]},
        {type: 'button', x: 5, y: 45, width: 100, height: 25, text: 'Level Two', action: [['Stage', 'change', 'level'], ['Level', 'change', 'two']]},
      ],
    },
    'level': {
      bodies: [
        {type: 'button', x: 5, y: 5, width: 100, height: 25, text: 'Back', action: ['Stage', 'change', 'intro']},

      ]
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
    'two': {
      bodies: [
        {type: 'hero', x: 150, y: 50},
        {type: 'enemy', x: 50, y: 150},
        {type: 'hero', x: 20, y: 350},
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
        'mousedown': [['Mouse', 'change', 'default'], ['Stage', 'change', 'second']],
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
