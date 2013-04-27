define([], function () {
  var keys = {};
  var prevFire = false;

  $(document).keydown(function (e) {
    keys[e.keyCode] = true;
    e.stopPropagation();
    e.stopImmediatePropagation();
    return false;
  });

  $(document).keyup(function (e) {
    keys[e.keyCode] = false;
    e.stopPropagation();
    e.stopImmediatePropagation();
    return false;
  });

  function fire () {
    var retVal = keys[32] && !prevFire;
    prevFire = keys[32];
    return retVal;
  }

  function reset () {
    for (var key in keys) {
      keys[key] = false;
    }
  }

  // wasd and arrow keys
  return {
    up:        function () { return keys[38] || keys[87]; },
    left:      function () { return keys[37] || keys[65]; },
    right:     function () { return keys[39] || keys[68]; },
    fire:      fire,
    resetKeys: reset
  };
});
