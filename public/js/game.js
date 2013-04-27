define([
  'game/input',
  'game/player',
  'game/asteroidsManager',
  'game/shared'
], function (
  inp,
  player,
  asteroidsManager,
  shared
) {
  var WIDTH
    , HEIGHT
    , BULLET_SPEED  = 15;

  var renderer
    , camera
    , scene
    , ship
    , bullets   = [];

  function init(options) {
    WIDTH  = options.WIDTH  || 1440;
    HEIGHT = options.HEIGHT || 700;

    shared.init(options);

    var NEAR       = 0.1
      , FAR        = 10000;

    var $container = $('#game');
    renderer = new THREE.WebGLRenderer();
    camera   = new THREE.OrthographicCamera(WIDTH / 2, -WIDTH / 2, HEIGHT / 2, -HEIGHT / 2, HEIGHT / 2, NEAR, FAR);
    scene    = new THREE.Scene();

    renderer.setSize(WIDTH, HEIGHT);
    $container.append(renderer.domElement);

    scene.add(camera);

    options.scene = scene;
    asteroidsManager.init(options);

    addShip('models/ship.js');
  }

  function addShip(_model){
    var loader = new THREE.JSONLoader(false);
    loader.load(_model, function (geometry, materials) {
      var mesh  = new THREE.Mesh(geometry); // new THREE.MeshFaceMaterial(materials)
      var mesh2 = new THREE.Mesh(geometry); // new THREE.MeshFaceMaterial(materials)
      var mesh3 = new THREE.Mesh(geometry); // new THREE.MeshFaceMaterial(materials)
      var mesh4 = new THREE.Mesh(geometry); // new THREE.MeshFaceMaterial(materials)

      mesh.position.x = mesh.position.y = mesh.position.z = 0;
      mesh.rotation.x = mesh.rotation.y = mesh.rotation.z = 0;
      mesh.scale.x    = mesh.scale.y    = mesh.scale.z    = 1;

      mesh.position.z = -100;
      mesh.rotation.x = 90;

      mesh2.rotation = mesh3.rotation = mesh4.rotation = mesh.rotation;
      mesh2.scale    = mesh3.scale    = mesh4.scale    = mesh.scale;

      scene.add(mesh);
      scene.add(mesh2);
      scene.add(mesh3);
      scene.add(mesh4);
      ship = mesh;

      player.init({
        meshes:           [ship, mesh2, mesh3, mesh4],
        updateFourMeshes: shared.updateFourMeshes,
        addBullet:        addBullet
      });
    });
  }

  function addBullet(x, y, rot) {
    var loader = new THREE.JSONLoader(false);
    loader.load('models/asteroid.js', function (geometry, materials) {
      var mesh  = new THREE.Mesh(geometry); // new THREE.MeshFaceMaterial(materials)

      mesh.position.x = x + Math.sin(rot) * 40;
      mesh.position.y = y - Math.cos(rot) * 40;
      mesh.position.z = 0;
      mesh.rotation.x = mesh.rotation.y = mesh.rotation.z = 0;
      mesh.scale.x    = mesh.scale.y    = mesh.scale.z    = 10;

      scene.add(mesh);

      bullets.push({
        dx:    Math.sin(rot) * BULLET_SPEED,
        dy:    Math.cos(rot) * BULLET_SPEED,
        life:  1000,
        mesh:  mesh
      });
    });
  }

  function animate() {
    requestAnimationFrame(animate);
    asteroidsManager.update();
    updateBullets();
    updatePlayer();
    render();
  }

  function updateBullets() {
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

  function updatePlayer() {
    if (inp.up()) {
      player.accelerate();
    }

    if (inp.left()) {
      player.turnLeft();
    }

    if (inp.right()) {
      player.turnRight();
    }

    if (inp.fire()) {
      player.fire();
    }

    player.update();
  }

  function render() {
    renderer.render(scene, camera);
  }

  return {
    init:  init,
    start: animate
  };

});
