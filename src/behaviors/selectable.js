'use strict';

plexi.behavior('Selectable', function (require, define) {
  var Selectable = function () {
    this.addProps(['selectAction']);
  };

  function applyAction(self, action, body) {
    var fn = action[0];
    if (fn[0] === '@') {
      self[fn.slice(1)].apply(self, [body].concat(action.slice(1)));
    } else {
      plexi.publish(action.map(function (a) {
        return a[0] === '@' ? body[a.slice(1)] : a;
      }));
    }

  }

  Selectable.prototype.select = function (body) {
    var action = this.prop(body, 'selectAction');
    var fn = action[0];
    if (fn instanceof Array) {
      action.forEach(function (a) {
        applyAction(this, a, body);
      }.bind(this));
    } else {
      applyAction(this, action, body);
    }
    //plexi.publish(this.prop(body, 'selectAction'));
  };

  return define(Selectable);
});
