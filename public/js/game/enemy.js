define([], function () {
  var ACCELERATION_RATE = .2
    , TURN_RATE         = 4
    , MAX_SPEED         = 10
    , HEIGHT
    , WIDTH;

  var updateFourMeshes
    , addBullet
    , meshes = [];

  var velocity = {
    dx: 2,
    dy: 2
  };



  var invincible = false
  ,   timer      = 0
  ,   shotTimer  = 0
  ,   threshold
  ,   startX
  ,   startY;

  function init(options) {
    WIDTH  = options.WIDTH  || 700;
    HEIGHT = options.HEIGHT || 350;
    meshes = options.meshes;

    updateFourMeshes = options.updateFourMeshes;
    addBullet = options.addBullet;

    threshold = Math.floor(Math.random() * 30000 + 60000);
    startY = Math.random() * (HEIGHT - (HEIGHT * -1)) -HEIGHT;
    startX;
    if(startY < 300)
      startX = WIDTH + 100;
    else
      startX = -WIDTH - 100;

    for(var n = 0; n < meshes.length; ++n){
      meshes[n].position.x = WIDTH + 100;
      meshes[n].position.y = startY;
    }
  }

  // function turnLeft() {
  //   if (!meshes[0]) return;
  //   meshes[0].rotation.y -= Math.PI / 180 * TURN_RATE;
  // }

  // function turnRight() {
  //   if (!meshes[0]) return;
  //   meshes[0].rotation.y += Math.PI / 180 * TURN_RATE;
  // }

  // function accelerate() {
  //   if (!meshes[0]) return;

  //   velocity.dy -= Math.cos(meshes[0].rotation.y) * ACCELERATION_RATE;
  //   velocity.dx += Math.sin(meshes[0].rotation.y) * ACCELERATION_RATE;

  //   if (velocity.dx > MAX_SPEED)  velocity.dx = MAX_SPEED;
  //   if (velocity.dy > MAX_SPEED)  velocity.dy = MAX_SPEED;
  //   if (velocity.dx < -MAX_SPEED) velocity.dx = -MAX_SPEED;
  //   if (velocity.dy < -MAX_SPEED) velocity.dy = -MAX_SPEED;
  // }

  function update() {
    if(timer > threshold){
      move();
    }
    else
      timer += 20;
  }

  function move(){
    shotTimer += 10;

    if(shotTimer > 3000){
      fire();
      shotTimer = 0;
    }

    for(var n = 0; n < meshes.length; ++n){
      meshes[n].position.x -= velocity.dx;
    }

    if(meshes[0].position.x < (-startX) || meshes[0].position.x > (startX+1)){
      velocity.dx *= -1;
      timer = 0;
      startY = Math.random() * (HEIGHT - (HEIGHT * -1)) -HEIGHT;
      for(var n = 0; n < meshes.length; ++n)
        meshes[n].position.y = startY;
    }
  }

  function fire() {
    addBullet(meshes[0].position.x, meshes[0].position.y, meshes[0].rotation.y, 3);
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

  // function addTime(){
  //   timer += 10;
  //   if(timer > 2000){
  //     invincible = false;
  //     timer = 0;
  //     $('.death').css('display', 'none');
  //   }
  // }

  function resetPos(){
    meshes[0].position.x = meshes[0].position.y = velocity.dx = velocity.dy = 0;
  }

  return {
    update:     update,
    init:       init,
    get:        get,
    getPlayerData: getPlayerData,
    resetTimer: function(){timer = 0;}
  };
});
