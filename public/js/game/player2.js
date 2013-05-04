define([], function () {
  var ACCELERATION_RATE = .2
    , TURN_RATE         = 4
    , MAX_SPEED         = 20
    , HEIGHT
    , WIDTH;

  var updateFourMeshes
    , addBullet
    , meshes = [];

  var velocity = {
    dx: 0,
    dy: 0
  };

  var invincible  = false
  ,   timer       = 0
  ,   visibleFlag = true;

  function init(options) {
    WIDTH  = options.WIDTH  || 1440;
    HEIGHT = options.HEIGHT || 700;
    meshes = options.meshes;

    updateFourMeshes = options.updateFourMeshes;
    addBullet = options.addBullet;
  }

  function turnLeft() {
    if (!meshes[0]) return;
    meshes[0].rotation.y -= Math.PI / 180 * TURN_RATE;
  }

  function turnRight() {
    if (!meshes[0]) return;
    meshes[0].rotation.y += Math.PI / 180 * TURN_RATE;
  }

  function accelerate() {
    if (!meshes[0]) return;

    velocity.dy -= Math.cos(meshes[0].rotation.y) * ACCELERATION_RATE;
    velocity.dx += Math.sin(meshes[0].rotation.y) * ACCELERATION_RATE;

    if (velocity.dx > MAX_SPEED)  velocity.dx = MAX_SPEED;
    if (velocity.dy > MAX_SPEED)  velocity.dy = MAX_SPEED;
    if (velocity.dx < -MAX_SPEED) velocity.dx = -MAX_SPEED;
    if (velocity.dy < -MAX_SPEED) velocity.dy = -MAX_SPEED;
  }

  function update(data) {
    meshes[0].position.x = data.x;
    meshes[0].position.y = data.y;

    for (var j = 0; j < 3; ++j) {
      meshes[j + 1].position.x = data.meshes[j].x;
      meshes[j + 1].position.y = data.meshes[j].y;
    }
  }

  function fire() {
    addBullet(meshes[0].position.x, meshes[0].position.y, meshes[0].rotation.y, 2);
  }

  function get(){
    return meshes[0];
  }

  function getPlayerData() {
    return [{
      x:     meshes[0].position.x,
      y:     meshes[0].position.y,
      rotx:  meshes[0].rotation.x,
      roty:  meshes[0].rotation.y,
      dx:    velocity.dx,
      dy:    velocity.dy,
      drotx: 0,
      droty: 0
    }];
  }

  function addTime(){
    timer += 10;
    if (timer % 50 == 0) {
      for(var n = 0; n < meshes.length; ++n)
        meshes[n].material.visible = visibleFlag;
      visibleFlag = !visibleFlag;
    }

    if (timer > 2000){
      invincible = false;
      timer = 0;
      for(var n = 0; n < meshes.length; ++n)
        meshes[n].material.visible = true;
    }
  }

  function resetPos(){
    meshes[0].position.x = meshes[0].position.y = velocity.dx = velocity.dy = 0;
  }

  return {
    turnLeft:   turnLeft,
    turnRight:  turnRight,
    accelerate: accelerate,
    fire:       fire,
    update:     update,
    init:       init,
    get:        get,
    getPlayerData: getPlayerData,
    getInvincible: function(){return invincible;},
    setInvincible: function(){invincible = true; resetPos()},
    addTime:    addTime
  };
});
