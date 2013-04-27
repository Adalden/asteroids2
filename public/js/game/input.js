define([], function () {
  var keys = {};

  $(document).keydown(function (e) {
    keys[e.keyCode] = true;
    // e.stopPropagation();
    // e.stopImmediatePropagation();
    // return false;
  });

  $(document).keyup(function (e) {
    keys[e.keyCode] = false;
    // e.stopPropagation();
    // e.stopImmediatePropagation();
    // return false;
  });

  // wasd and arrow keys
  return {
    left:      function () { return keys[37] || keys[65]; },
    right:     function () { return keys[39] || keys[68]; },
    up:        function () { return keys[38] || keys[87]; },
    resetKeys: function () { for (var key in keys) { keys[key] = false; } }
  };
});
