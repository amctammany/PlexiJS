'use strict';

describe('plexi::Behavior::Label', function () {
  var Label;

  beforeEach(function () {
    Label = plexi.behavior('Label');

  });

  it('should be true', function () {
    expect(!!Label).toBe(true);
  });
});
