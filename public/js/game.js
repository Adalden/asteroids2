define([
  'game/input',
  'game/player'
], function (
  inp,
  player
) {
  var WIDTH
    , HEIGHT
    , NUM_ASTEROIDS = 2
    , BULLET_SPEED = 15;

  var renderer
    , camera
    , scene
    , ship
    , asteroids = []
    , bullets   = [];

  function init(options) {
    WIDTH  = options.WIDTH   || 1440;
    HEIGHT = options.HEIGHTH || 700;

    var VIEW_ANGLE = 45
      , ASPECT     = WIDTH / HEIGHT
      , NEAR       = 0.1
      , FAR        = 10000;

    var $container = $('#game');
    renderer = new THREE.WebGLRenderer();
    camera   = new THREE.OrthographicCamera(WIDTH / 2, -WIDTH / 2, HEIGHT / 2, -HEIGHT / 2, HEIGHT / 2, NEAR, FAR);
    scene    = new THREE.Scene();

    renderer.setSize(WIDTH, HEIGHT);
    $container.append(renderer.domElement);

    scene.add(camera);
    addShip('models/ship.js');

    for (var i = 0; i < NUM_ASTEROIDS; ++i)
      addAsteroid('models/asteroid.js', 'models/asteroid.jpg');
  }

  function addAsteroid(_model, meshTexture, cb) {
    cb = cb || function () {};
    var material = undefined;
    if (meshTexture) material = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture(meshTexture) });
    var loader = new THREE.JSONLoader(false);
    loader.load(_model, function (geometry, materials) {
      var mesh  = new THREE.Mesh(geometry, material); // new THREE.MeshFaceMaterial(materials)
      var mesh2 = new THREE.Mesh(geometry, material); // new THREE.MeshFaceMaterial(materials)
      var mesh3 = new THREE.Mesh(geometry, material); // new THREE.MeshFaceMaterial(materials)
      var mesh4 = new THREE.Mesh(geometry, material); // new THREE.MeshFaceMaterial(materials)

      mesh.position.z = 0;
      mesh.position.x = (Math.random() - .5) * WIDTH;
      mesh.position.y = (Math.random() - .5) * HEIGHT;
      mesh.rotation.x = mesh.rotation.y = mesh.rotation.z = 0;
      mesh.scale.x    = mesh.scale.y    = mesh.scale.z    = 120;

      mesh2.rotation = mesh3.rotation = mesh4.rotation = mesh.rotation;
      mesh2.scale    = mesh3.scale    = mesh4.scale    = mesh.scale;

      mesh.geometry.boundingSphere.radius -= .2;

      scene.add(mesh);
      scene.add(mesh2);
      scene.add(mesh3);
      scene.add(mesh4);
      var myAsteroid = createAsteroid([mesh, mesh2, mesh3, mesh4]);
      asteroids.push(myAsteroid);
      cb(myAsteroid);
    });
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
        updateFourMeshes: updateFourMeshes,
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

  function createAsteroid(meshes) {
    var SPEED = 3;

    return {
      rotX:   (Math.random() - .5) / 50,
      rotY:   (Math.random() - .5) / 50,
      dx:     (Math.random() - .5) * SPEED,
      dy:     (Math.random() - .5) * SPEED,
      meshes: meshes
    };
  }

  function animate() {
    requestAnimationFrame(animate);
    updateAsteroids();
    updateBullets();
    updatePlayer();
    render();
  }

  function updateBullets() {
    for (var i = 0; i < bullets.length; ++i) {
      bullets[i].mesh.position.x += bullets[i].dx;
      bullets[i].mesh.position.y -= bullets[i].dy;

      if (bullets[i].mesh.position.x < -WIDTH / 2)  bullets[i].mesh.position.x += WIDTH;
      if (bullets[i].mesh.position.x > WIDTH / 2)   bullets[i].mesh.position.x -= WIDTH;
      if (bullets[i].mesh.position.y < -HEIGHT / 2) bullets[i].mesh.position.y += HEIGHT;
      if (bullets[i].mesh.position.y > HEIGHT / 2)  bullets[i].mesh.position.y -= HEIGHT;

      var isCollision = false;
      for (var j = 0; j < asteroids.length && !isCollision; ++j) {
        if (collides(asteroids[j].meshes[0], bullets[i].mesh)) {
          isCollision = true;
          scene.remove(bullets[i].mesh);
          bullets.splice(i--, 1);
          hitAsteroid(asteroids[j], j);
        }
      }
      if (isCollision) continue;

      bullets[i].life -= 20;
      if (bullets[i].life < 0) {
        scene.remove(bullets[i].mesh);
        bullets.splice(i--, 1);
      }
    }
  }

  function hitAsteroid(asteroid, index) {
    var SPEED = 3;

    var newScale = asteroid.meshes[0].scale.x - 30;

    if (newScale <= 0) {
      for (var i = 0; i < asteroid.meshes.length; ++i)
        scene.remove(asteroid.meshes[i]);
      asteroids.splice(index, 1)
      return;
    }

    asteroid.meshes[0].scale.x = asteroid.meshes[0].scale.y = asteroid.meshes[0].scale.z = newScale;

    var newAsteroid = addAsteroid('models/asteroid.js', 'models/asteroid.jpg', function (newAsteroid) {
      newAsteroid.meshes[0].scale.x = newAsteroid.meshes[0].scale.y = newAsteroid.meshes[0].scale.z = newScale;
      newAsteroid.meshes[0].position.x = asteroid.meshes[0].position.x + asteroid.dx * newScale;
      newAsteroid.meshes[0].position.y = asteroid.meshes[0].position.y + asteroid.dy * newScale;
      newAsteroid.meshes[0].position.z = asteroid.meshes[0].position.z;

      asteroid.meshes[0].position.x -= asteroid.dx * newScale;
      asteroid.meshes[0].position.y -= asteroid.dy * newScale;

      asteroid.dx = (Math.random() - .5) * SPEED;
      asteroid.dy = (Math.random() - .5) * SPEED;
    });
  }

  function collides(obj1, obj2) {
    var m2 = obj1.position;
    var dist2 = obj1.geometry.boundingSphere.radius * obj1.scale.x;

    var m1 = obj2.position;
    var dist = dist2 + obj2.geometry.boundingSphere.radius * obj2.scale.x;

    var d = Math.sqrt(Math.pow(m1.x - m2.x, 2) + Math.pow(m1.y - m2.y, 2) + Math.pow(m1.z - m2.z, 2));

    return d <= dist;
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

  function updateAsteroids() {
    for (var i = 0; i < asteroids.length; ++i) {
      if (!asteroids[i].meshes[0]) continue;
      var a = asteroids[i];

      a.meshes[0].position.x += a.dx;
      a.meshes[0].position.y += a.dy;

      a.meshes[0].rotation.x += a.rotX;
      a.meshes[0].rotation.y += a.rotY;

      if (a.meshes[0].position.x > WIDTH / 2)   a.meshes[0].position.x -= WIDTH;
      if (a.meshes[0].position.x < -WIDTH / 2)  a.meshes[0].position.x += WIDTH;
      if (a.meshes[0].position.y > HEIGHT / 2)  a.meshes[0].position.y -= HEIGHT;
      if (a.meshes[0].position.y < -HEIGHT / 2) a.meshes[0].position.y += HEIGHT;

      updateFourMeshes(a.meshes);
    }
  }

  function updateFourMeshes(meshes) {
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

  function render() {
    renderer.render(scene, camera);
  }

  return {
    init:  init,
    start: animate
  };
});
