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

  function update() {
    if (!meshes[0]) return;
    meshes[0].position.x += velocity.dx;
    meshes[0].position.y += velocity.dy;

    if (meshes[0].position.x >= WIDTH / 2)   meshes[0].position.x -= WIDTH;
    if (meshes[0].position.x <= -WIDTH / 2)  meshes[0].position.x += WIDTH;
    if (meshes[0].position.y >= HEIGHT / 2)  meshes[0].position.y -= HEIGHT;
    if (meshes[0].position.y <= -HEIGHT / 2) meshes[0].position.y += HEIGHT;

    updateFourMeshes(meshes);
  }

  function fire() {
    addBullet(meshes[0].position.x, meshes[0].position.y, meshes[0].rotation.y);
  }

  return {
    turnLeft:   turnLeft,
    turnRight:  turnRight,
    accelerate: accelerate,
    fire:       fire,
    update:     update,
    init:       init
  };
});
