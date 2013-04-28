define([], function () {
  var keys = {};
  var prevFire = false;
  var controls = [];

  $(document).keydown(function (e) {
    for(var n = 0; n < controls.length; ++n){
      if(controls[n] == e.keyCode)
        keys[e.keyCode] = true;
    }
    if (e.keyCode === 32 || e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39) {
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    }
  });

  $(document).keyup(function (e) {
    keys[e.keyCode] = false;
    if (e.keyCode === 32 || e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39) {
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    }
  });

  function fire () {
    var retVal = keys[controls[3]] && !prevFire;
    prevFire = keys[controls[3]];
    return retVal;
  }

  function reset () {
    for (var key in keys) {
      keys[key] = false;
    }
  }

  function set(userControls){
    controls = userControls;
    controls.push(27);
  }

  return {
    up:        function () { return keys[controls[0]];},
    left:      function () { return keys[controls[1]];},
    right:     function () { return keys[controls[2]];},
    pause:     function () { return keys[27]; },
    fire:      fire,
    resetKeys: reset,
    set:       set,
  };
});