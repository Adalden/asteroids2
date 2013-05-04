define([
  'game/shared'
], function (
  shared
) {
  var WIDTH
    , HEIGHT
    , SPEED         = 3
    , NUM_ASTEROIDS = 2;

  var asteroidModel;

  var score
    , scene
    , asteroids = []
    , level = 1
    , p1Score = 0
    , p2Score = 0;

  function init(options) {
    WIDTH  = options.WIDTH  || 1440;
    HEIGHT = options.HEIGHT || 700;

    scene = options.scene;

    for (var i = 0; i < NUM_ASTEROIDS; ++i) {
      createAsteroid();
    }
  }

  function nextLevel(){
    if(level <= 12)
      ++level;

    $('.level').html('Level: ' + level);

    if(level % 2 != 0 && level < 12)
      ++NUM_ASTEROIDS;

    for(var n = 0; n < NUM_ASTEROIDS; ++n){
      createAsteroid();
    }
  }

  function createAsteroid(x, y, scale) {
    var mesh  = new THREE.Mesh(asteroidModel.geometry.clone(), asteroidModel.material);
    var mesh2 = new THREE.Mesh(asteroidModel.geometry.clone(), asteroidModel.material);
    var mesh3 = new THREE.Mesh(asteroidModel.geometry.clone(), asteroidModel.material);
    var mesh4 = new THREE.Mesh(asteroidModel.geometry.clone(), asteroidModel.material);

    if (x !== undefined) {
      mesh.position.x = x;
    } else {
      var safeRadius = 150;
      mesh.position.x = safeRadius + Math.random() * (WIDTH / 2 - safeRadius)
      mesh.position.x = Math.random() > .5 ? mesh.position.x : -mesh.position.x;
    }

    if (y !== undefined) {
      mesh.position.y = y;
    } else {
      var safeRadius = 150;
      mesh.position.y = safeRadius + Math.random() * (HEIGHT / 2 - safeRadius)
      mesh.position.y = Math.random() > .5 ? mesh.position.y : -mesh.position.y;
    }

    console.log(mesh.position.x, mesh.position.y);

    // mesh.position.x = x !== undefined ? x : (Math.random() - .5) * WIDTH;
    // mesh.position.y = y !== undefined ? y : (Math.random() - .5) * HEIGHT;
    mesh.position.z = 0;

    mesh.rotation.x = mesh.rotation.y = mesh.rotation.z = 0;
    mesh.scale.x    = mesh.scale.y    = mesh.scale.z    = scale !== undefined ? scale : 120;

    mesh2.rotation = mesh3.rotation = mesh4.rotation = mesh.rotation;
    mesh2.scale    = mesh3.scale    = mesh4.scale    = mesh.scale;

    mesh2.position.x = mesh2.position.y = -1000;
    mesh3.position.x = mesh3.position.y = -1000;
    mesh4.position.x = mesh4.position.y = -1000;

    mesh.geometry.boundingSphere.radius -= .2;

    scene.add(mesh);
    scene.add(mesh2);
    scene.add(mesh3);
    scene.add(mesh4);

    asteroids.push(makeAsteroidObject([mesh, mesh2, mesh3, mesh4]));
  }

  function makeAsteroidObject(meshes) {
    return {
      rotX:   (Math.random() - .5) / 50,
      rotY:   (Math.random() - .5) / 50,
      dx:     (Math.random() - .5) * SPEED,
      dy:     (Math.random() - .5) * SPEED,
      meshes: meshes
    };
  }

  function update(data) {
    for (var i = 0; i < asteroids.length; ++i) {
      asteroids[i].meshes[0].position.x = data[i].x;
      asteroids[i].meshes[0].position.y = data[i].y;
      asteroids[i].meshes[0].rotation.x = data[i].rotx;
      asteroids[i].meshes[0].rotation.y = data[i].roty;

      for (var j = 0; j < 3; ++j) {
        asteroids[i].meshes[j + 1].position.x = data[i].meshes[j].x;
        asteroids[i].meshes[j + 1].position.y = data[i].meshes[j].y;
      }
    }
  }

  function checkBullet(bullet) {
    for (var i = 0; i < asteroids.length; ++i) {
      if (shared.collides(asteroids[i].meshes[0], bullet.mesh)) {
        var oldX = asteroids[i].meshes[0].position.x
          , oldY = asteroids[i].meshes[0].position.y;

        updateScore(asteroids[i].meshes[0].scale.x, bullet.playerNum);
        hitAsteroid(i);
        return { res: true, x: oldX, y: oldY };
      }
    }
    return { res: false };
  }

  function updateScore(size, playerNum) {
    var score;
    if(playerNum == 1)
      score = p1Score;
    if(playerNum == 2)
      score = p2Score;

    if (size == 120)
      score += 10;
    if (size == 90)
      score += 20;
    if (size == 60)
      score += 30;
    if (size == 30)
      score += 50;

    if(playerNum == 1){
      $('.p1.score').html("Score: " + score);
      p1Score = score;
    }
    if(playerNum == 2){
      $('.p2.score').html("Score: " + score);
      p2Score = score;
    }
  }

  function hitAsteroid(i) {
    var newScale = asteroids[i].meshes[0].scale.x - 30;

    if (newScale <= 0) {
      for (var j = 0; j < asteroids[i].meshes.length; ++j) {
        scene.remove(asteroids[i].meshes[j]);
      }
      asteroids.splice(i, 1);

      if(asteroids.length == 0)
        nextLevel();
      return;
    }

    asteroids[i].meshes[0].scale.x = asteroids[i].meshes[0].scale.y = asteroids[i].meshes[0].scale.z = newScale;

    var speed = SPEED * 4 - newScale / 10;

    asteroids[i].dx = (Math.random() - .5) * speed;
    asteroids[i].dy = (Math.random() - .5) * speed;

    createAsteroid(asteroids[i].meshes[0].position.x, asteroids[i].meshes[0].position.y, newScale);
  }

  function setModels(models) {
    asteroidModel = models.asteroid;
  }

  function checkShip(shipObj){
    for(var n = 0; n < asteroids.length; ++n){
      if (shared.collides(asteroids[n].meshes[0], shipObj))
        return true;
    }
    return false;
  }

  function getAsteroidData() {
    var test = [];

    for (var i = 0; i < asteroids.length; ++i) {
      test.push({
        x:     asteroids[i].meshes[0].position.x,
        y:     asteroids[i].meshes[0].position.y,
        rotx:  asteroids[i].meshes[0].rotation.x,
        roty:  asteroids[i].meshes[0].rotation.y,
        dx:    asteroids[i].dx,
        dy:    asteroids[i].dy,
        drotx: asteroids[i].rotX,
        droty: asteroids[i].rotY
      });
    }

    return test;
  }

  return {
    init:        init,
    update:      update,
    setModels:   setModels,
    checkBullet: checkBullet,
    checkShip:   checkShip,
    getScores:   function (){return{p1: p1Score, p2: p2Score};},
    getAsteroidData: getAsteroidData
  };
});
