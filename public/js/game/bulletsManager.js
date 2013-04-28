define([
  'game/shared'
], function (
  shared
) {
  var WIDTH
    , HEIGHT
    , BULLET_SPEED = 15;

  var scene
    , asteroidsManager
    , bullets = [];

  function init(options) {
    WIDTH  = options.WIDTH  || 1440;
    HEIGHT = options.HEIGHT || 700;

    scene = options.scene;
    asteroidsManager = options.asteroidsManager
  }

  function update() {
    for (var i = 0; i < bullets.length; ++i) {
      bullets[i].mesh.position.x += bullets[i].dx;
      bullets[i].mesh.position.y -= bullets[i].dy;

      shared.checkBounds(bullets[i].mesh);

      var isCollision = asteroidsManager.checkBullet(bullets[i]);
      if (isCollision) {
        scene.remove(bullets[i].mesh);
        bullets.splice(i--, 1);
        continue;
      }

      bullets[i].life -= 20;
      if (bullets[i].life < 0) {
        scene.remove(bullets[i].mesh);
        bullets.splice(i--, 1);
      }
    }
  }

  function addBullet(x, y, rot) {
    var loader = new THREE.JSONLoader(false);
    loader.load('models/bullet.js', function (geometry, materials) {
      var mesh  = new THREE.Mesh(geometry); // new THREE.MeshFaceMaterial(materials)

      mesh.position.x = x + Math.sin(rot) * 40;
      mesh.position.y = y - Math.cos(rot) * 40;
      mesh.position.z = 0;
      mesh.rotation.x = mesh.rotation.y = mesh.rotation.z = 0;
      mesh.scale.x    = mesh.scale.y    = mesh.scale.z    = 1;
      mesh.rotation.z = rot + Math.PI;

      scene.add(mesh);

      bullets.push({
        dx:    Math.sin(rot) * BULLET_SPEED,
        dy:    Math.cos(rot) * BULLET_SPEED,
        life:  1000,
        mesh:  mesh
      });
    });
  }

  return {
    init: init,
    update: update,
    addBullet: addBullet
  };
});
