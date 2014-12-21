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
    'label': {
      behaviors: ['Label'],
      textColor: 'black',
      padding: 10,

    },
    'tile': {
      behaviors: ['Rectangle', 'Selectable'],
      stroke: 'black',
      selectAction: ['Level', 'flood', '@row', '@column']
    },
    //'tile-group': {
      //behaviors: ['RandomGroup'],
      //template: 'tile',
      //x: 50,
      //y: 50,
      //columns: 4,
      //rows: 4,
      //width: 200,
      //height: 200,
      //padding: 3,
    //},

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
        {type: 'label', x: 300, y: 5, text: 'Score: ', height: 25, width: 200}
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
        'mouseup': ['World', 'select', '@x', '@y'],
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
      vars: {
        time: 0,
        score: 0,
      },
    },
  },

};


plexi.load(config);
plexi.bootstrap('main');
