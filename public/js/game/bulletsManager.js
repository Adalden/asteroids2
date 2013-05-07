define([
  'game/shared',
  'game/enemy'
], function (
  shared,
  enemy
) {
  var WIDTH
    , HEIGHT
    , BULLET_SPEED = 15;

  var scene
    , bulletModel
    , bullets = [];

  function init(options) {
    WIDTH  = options.WIDTH  || 1440;
    HEIGHT = options.HEIGHT || 700;

    scene = options.scene;
  }

  function update(data) {
    var toDestroy = [];
    for (var i = 0; i < data.length; ++i) {
      bullets[i].mesh.position.x = data[i].x;
      bullets[i].mesh.position.y = data[i].y;
      bullets[i].life = data[i].life;

      if (bullets[i].life <= 0) {
        toDestroy.push(i);
      }
    }

    for (var i = 0; i < toDestroy.length; ++i) {
      destroyBullet(toDestroy[i]);
    }
  }

  function checkCollisions(asteroidsManager, cb) {
    for (var i = 0; i < bullets.length; ++i) {
      var result = asteroidsManager.checkBullet(bullets[i]);
      if (result.res) {
        cb(result.x, result.y, bullets[i].mesh.rotation.z);
        destroyBullet(i);
        --i;
      }
    }
  }

  function checkEnemyCollision(player){
    for(var n = 0; n < bullets.length; ++n){
      if(shared.collides(bullets[n].mesh, player) && bullets[n].playerNum == 3){
        destroyBullet(n);
        --n;
        return true;
      }
    }
    return false;
  }

  function destroyBullet(i) {
    scene.remove(bullets[i].mesh);
    bullets.splice(i, 1);
  }

  function addBullet(x, y, rot, playerNum) {
    var mesh  = new THREE.Mesh(bulletModel.geometry, bulletModel.material); // new THREE.MeshFaceMaterial(materials)

    mesh.position.x = x + Math.sin(rot) * 40;
    mesh.position.y = y - Math.cos(rot) * 40;
    mesh.position.z = 0;
    mesh.rotation.x = mesh.rotation.y = mesh.rotation.z = 0;
    mesh.scale.x    = mesh.scale.y    = mesh.scale.z    = 1;
    mesh.rotation.z = rot + Math.PI;

    scene.add(mesh);

    bullets.push({
      dx:       Math.sin(rot) * BULLET_SPEED,
      dy:       Math.cos(rot) * BULLET_SPEED,
      life:     1000,
      mesh:     mesh,
      playerNum:playerNum
    });
  }

  function setModels(models) {
    bulletModel = models.bullet;
  }

  function getBulletData() {
    var data = [];
    for (var i = 0; i < bullets.length; ++i) {
      data.push({
        x: bullets[i].mesh.position.x,
        y: bullets[i].mesh.position.y,
        dx: bullets[i].dx,
        dy: bullets[i].dy,
        life: bullets[i].life
      });
    }
    return data;
  }

  return {
    init:            init,
    update:          update,
    setModels:       setModels,
    addBullet:       addBullet,
    destroyBullet:   destroyBullet,
    checkCollisions: checkCollisions,
    getBulletData:   getBulletData,
    checkEnemyCollision: checkEnemyCollision
  };
});
