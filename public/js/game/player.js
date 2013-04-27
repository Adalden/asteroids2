define([], function () {
  var ACCELERATION_RATE = .5
    , TURN_RATE         = 5
    , MAX_SPEED         = 50
    , HEIGHT
    , WIDTH;

  var meshes = [];

  var velocity = {
    dx: 0,
    dy: 0
  };

  function init(options) {
    WIDTH  = options.WIDTH  || 1440;
    HEIGHT = options.HEIGHT || 700;
    meshes = options.meshes;
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

  function update() {
    if (!meshes[0]) return;
    meshes[0].position.x += velocity.dx;
    meshes[0].position.y += velocity.dy;

    if (meshes[0].position.x >= WIDTH/2)   meshes[0].position.x -= WIDTH;
    if (meshes[0].position.x <= -WIDTH/2)  meshes[0].position.x += WIDTH;
    if (meshes[0].position.y >= HEIGHT/2)  meshes[0].position.y -= HEIGHT;
    if (meshes[0].position.y <= -HEIGHT/2) meshes[0].position.y += HEIGHT;

    meshes[1].position.y = meshes[0].position.y;
    meshes[1].position.z = meshes[0].position.z;
    if (meshes[0].position.x > 0)
      meshes[1].position.x = meshes[0].position.x - WIDTH;
    else
      meshes[1].position.x = meshes[0].position.x + WIDTH;

    meshes[2].position.x = meshes[0].position.x;
    meshes[2].position.z = meshes[0].position.z;
    if (meshes[0].position.y > 0)
      meshes[2].position.y = meshes[0].position.y - HEIGHT;
    else
      meshes[2].position.y = meshes[0].position.y + HEIGHT;

    meshes[3].position.z = meshes[0].position.z;
    if (meshes[0].position.x > 0)
      meshes[3].position.x = meshes[0].position.x - WIDTH;
    else
      meshes[3].position.x = meshes[0].position.x + WIDTH;
    if (meshes[0].position.y > 0)
      meshes[3].position.y = meshes[0].position.y - HEIGHT;
    else
      meshes[3].position.y = meshes[0].position.y + HEIGHT;
  }

  return {
    turnLeft:   turnLeft,
    turnRight:  turnRight,
    accelerate: accelerate,
    update:     update,
    init:       init
  };
});
