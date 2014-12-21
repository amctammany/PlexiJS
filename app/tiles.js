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
    'tile': {
      behaviors: ['Rectangle', 'Selectable'],
      stroke: 'black',
      selectAction: ['Level', 'flood', '@index']
    },
    'tile-group': {
      behaviors: ['RandomGroup'],
      template: 'tile',
      fills: ['red', 'blue', 'green', 'yellow'],
      x: 50,
      y: 50,
      columns: 10,
      rows: 10,
      width: 500,
      height: 500,
      padding: 3,
    },

  },

  Stage: {
    'intro': {
      bodies: [
        {type: 'button', x: 200, y: 225, width: 200, height: 50, text: 'Start', action: [['Stage', 'change', 'level'], ['Level', 'change', 'random']]},
        {type: 'button', x: 200, y: 285, width: 200, height: 50, text: 'Scores', action: [['Stage', 'change', 'scores']]},
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
      behaviors: ['LevelTiled', 'LevelFlood'],
      rows: 10,
      columns: 10,
      width: 500,
      height: 500,
      x: 50,
      y: 50,
      template: {
        id: 'tile',
        fill: plexi.random(['red', 'blue', 'green', 'yellow']),
      },
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
