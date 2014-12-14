var config = {
  Canvas: {
    'main': {
      element: 'game-canvas',
      width: 600,
      height: 600,
    },
  },

  World: {
    'main': {
      behaviors: ['WorldSelectable'],

    }
  },

  BodyType: {
    'button': {
      behaviors: ['Button'],
      fill: 'red',
      textColor: 'black',
      padding: 8,
    },

  },

  Stage: {
    'intro': {
      bodies: [
        {type: 'button', x: 200, y: 225, width: 200, height: 50, text: 'Start', action: [['Stage', 'change', 'level'], ['Level', 'change', 'random']]},
        {type: 'button', x: 200, y: 285, width: 200, height: 50, text: 'Scores', action: [['Stage', 'change', 'scores'], ['Level', 'change', 'random']]},
      ],
    },
    'level': {
      bodies: [
        {type: 'button', x: 5, y: 5, width: 100, height: 25, text: 'Back', action: ['Stage', 'change', 'intro']},
      ],
    },
    'scores': {
      bodies: [
        {type: 'button', x: 5, y: 5, width: 100, height: 25, text: 'Back', action: ['Stage', 'change', 'intro']},
      ],
    },

  },

  Level: {
    'random': {
      bodies: [

      ],
    },
  },

  Mouse: {
    'default': {
      events: {
        'mousedown': ['World', 'select', '@x', '@y'],
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
