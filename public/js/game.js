define([
  'game/input',
  'game/input2',
  'game/player',
  'game/asteroidsManager',
  'game/bulletsManager',
  'game/shared',
  'game/enemy',
  'tmpl!templates/inGame'
], function (
  inp,
  inp2,
  player,
  asteroidsManager,
  bulletsManager,
  shared,
  player2,
  gSettingsTmpl
) {
  var WIDTH
    , HEIGHT;

  var player1model
    , player2model;

  var renderer
    , camera
    , scene
    , ship
    , enemy;

  var gameFlag    = false
    , pause       = false
    , player2Flag = false;

  var asteroidWorker
    , playerWorker
    , player2Worker
    , bulletsWorker;

  function init(options) {
    WIDTH  = options.WIDTH  || 1440;
    HEIGHT = options.HEIGHT || 700;

    shared.init(options);

    createWebWorkers();

    var NEAR       = 0.1
      , FAR        = 10000;

    var $container = $('#game');
    renderer = new THREE.WebGLRenderer();
    camera   = new THREE.OrthographicCamera(WIDTH / 2, -WIDTH / 2, HEIGHT / 2, -HEIGHT / 2, HEIGHT / 2, NEAR, FAR);
    scene    = new THREE.Scene();

    renderer.setSize(WIDTH, HEIGHT);
    $container.append(renderer.domElement);

    scene.add(camera);

    var light = new THREE.PointLight(0xFFFFFF, 10);
    light.position.set(0, 0, -1000);
    scene.add(light);

    gameFlag = true;

    options.scene = scene;
    asteroidsManager.init(options);
    bulletsManager.init(options);

    addShip();
  }

  function createWebWorkers() {
    asteroidWorker = new Worker('/js/workers/asteroid.js');
    asteroidWorker.onmessage = function (event) {
      asteroidsManager.update(event.data);
    };

    playerWorker = new Worker('/js/workers/asteroid.js');
    playerWorker.onmessage = function (event) {
      player.update(event.data[0]);
    };

    player2Worker = new Worker('/js/workers/asteroid.js');
    player2Worker.onmessage = function (event) {
      player2.update(event.data[0]);
    };

    bulletsWorker = new Worker('/js/workers/bullets.js');
    bulletsWorker.onmessage = function (event) {
      bulletsManager.update(event.data);
    };
  }

  function addShip(_model){
    var mesh  = new THREE.Mesh(player1model.geometry, player1model.material);
    var mesh2 = new THREE.Mesh(player1model.geometry, player1model.material);
    var mesh3 = new THREE.Mesh(player1model.geometry, player1model.material);
    var mesh4 = new THREE.Mesh(player1model.geometry, player1model.material);

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
  }

  function addBullet(x, y, rot) {
    bulletsManager.addBullet(x, y, rot)
  }

  function addShip2(_model){
    var mesh  = new THREE.Mesh(player2model.geometry, player2model.material);
    var mesh2 = new THREE.Mesh(player2model.geometry, player2model.material);
    var mesh3 = new THREE.Mesh(player2model.geometry, player2model.material);
    var mesh4 = new THREE.Mesh(player2model.geometry, player2model.material);

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
    enemy = mesh;
    player2.init({
      meshes:           [enemy, mesh2, mesh3, mesh4],
      updateFourMeshes: shared.updateFourMeshes,
      addBullet:        addBullet
    });
  }

  function animate() {
    if(gameFlag){
      requestAnimationFrame(animate);
      if(!pause){
        asteroidWorker.postMessage(asteroidsManager.getAsteroidData());
        updatePlayer();
        playerWorker.postMessage(player.getPlayerData());
        if (player2Flag) {
          updatePlayer2();
          player2Worker.postMessage(player2.getPlayerData());
        }
        bulletsWorker.postMessage(bulletsManager.getBulletData());

        setTimeout(function () {
          bulletsManager.checkCollisions(asteroidsManager);
        }, 10);
        render();
      }
    }
  }

  function stop(){
    gameFlag = false;
  }

  function updatePlayer() {
    if(inp.pause()){
      pause = true;
      showOptions();
    }
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
  }

  function updatePlayer2() {
    if(inp2.pause()){
      pause = true;
      showOptions();
    }
    if (inp2.up()) {
      player2.accelerate();
    }

    if (inp2.left()) {
      player2.turnLeft();
    }

    if (inp2.right()) {
      player2.turnRight();
    }

    if (inp2.fire()) {
      player2.fire();
    }
  }

  function render() {
    renderer.render(scene, camera);
  }

  function resume(){
    if(pause)
      pause = false;
    if(gameFlag)
      gameFlag = true;
  }

  function showOptions(){
    $('#game').css('opacity', '.1');
    $('.ingameOptions').html(gSettingsTmpl());
    $('.ingameOptions').css({display: 'block', opacity: '1'});
  }

  function start(playerOption, p1Controls, p2Controls){
    inp.set(p1Controls);
    inp2.set(p2Controls);

    //Two Players
    if(playerOption == 2){
      console.log("found 2");
      player2Flag = true;
      addShip2();
      $('.p2').css('display', 'block');
    }

    //Player with ally
    if(playerOption == 3){
      player2Flag = true;
    }

    animate();
  }

  function setModels(models) {
    player1model = models.player;
    player2model = models.player2;
    asteroidsManager.setModels(models);
    bulletsManager.setModels(models);
  }

  return {
    init:      init,
    start:     start,
    stop:      stop,
    setModels: setModels,
    resume:    resume
  };
});
