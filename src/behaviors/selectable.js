'use strict';

plexi.behavior('Selectable', function (require, define) {
  var Selectable = function () {
    this.addProps(['selectAction']);
  };


  Selectable.prototype.select = function (body) {
    var action = this.prop(body, 'selectAction');
    var fn = action[0];
    if (fn[0] === '@') {
      this[fn.slice(1)].apply(this, [body].concat(action.slice(1)));
    } else {
      plexi.publish(action);
    }
    //plexi.publish(this.prop(body, 'selectAction'));
  };

  return define(Selectable);
});
