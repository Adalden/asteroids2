define([
  'game/input',
  'game/input2',
  'game/player',
  'game/asteroidsManager',
  'game/bulletsManager',
  'game/shared',
  'game/enemy',
  'game/highScores',
  'tmpl!templates/inGame',
  'tmpl!templates/gameOver'
], function (
  inp,
  inp2,
  player,
  asteroidsManager,
  bulletsManager,
  shared,
  player2,
  hsManager,
  gSettingsTmpl,
  gameOverTmpl
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
    , player1Flag = true
    , player2Flag = true
    , p1Lives = 3
    , p2Lives = 3;

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
    var mesh  = new THREE.Mesh(player1model.geometry, new THREE.MeshLambertMaterial({ color: 0x000077 }));
    var mesh2 = new THREE.Mesh(player1model.geometry, new THREE.MeshLambertMaterial({ color: 0x000077 }));
    var mesh3 = new THREE.Mesh(player1model.geometry, new THREE.MeshLambertMaterial({ color: 0x000077 }));
    var mesh4 = new THREE.Mesh(player1model.geometry, new THREE.MeshLambertMaterial({ color: 0x000077 }));

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

  function addBullet(x, y, rot, playerNum) {
    bulletsManager.addBullet(x, y, rot, playerNum);
  }

  function addShip2(_model){
    var mesh  = new THREE.Mesh(player2model.geometry, new THREE.MeshLambertMaterial({ color: 0x770000 }));
    var mesh2 = new THREE.Mesh(player2model.geometry, new THREE.MeshLambertMaterial({ color: 0x770000 }));
    var mesh3 = new THREE.Mesh(player2model.geometry, new THREE.MeshLambertMaterial({ color: 0x770000 }));
    var mesh4 = new THREE.Mesh(player2model.geometry, new THREE.MeshLambertMaterial({ color: 0x770000 }));

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
        if(player1Flag){
          updatePlayer();
          playerWorker.postMessage(player.getPlayerData());
        }
        if(player2Flag){
          updatePlayer2();
          player2Worker.postMessage(player2.getPlayerData());
        }
        isGameOver();
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

    checkPlayerCollsion(player, ".p1");
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

    checkPlayerCollsion(player2, ".p2");
  }
  
  function checkPlayerCollsion(shipObj, playerStr){
    if (asteroidsManager.checkShip(shipObj.get())){
      if(playerStr == ".p1"){
        if(p1Lives > 0)
          --p1Lives;
        if(p1Lives <= 0){
          player1Flag = false;
          scene.remove(shipObj.get());
        }
        $('.p1.lives').html("Lives: " + p1Lives);
      }
      if(playerStr == ".p2"){
        if(p2Lives > 0)
          --p2Lives;
        if(p2Lives <= 0){
          player2Flag = false;
          scene.remove(shipObj.get());
        }
        $('.p2.lives').html("Lives: " + p2Lives);
      }
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
    
    //One Player
    if(playerOption == 1){
      player2Flag = false;
    }

    //Two Players
    if(playerOption == 2){
      addShip2();
      $('.p2').css('display', 'block');
    }

    //Player with ally
    if(playerOption == 3){
      addShip2();
    }

    animate();
  }

  function isGameOver(){
    if(player1Flag == false && player2Flag == false){
      gameFlag = false;
      $('#game').css('opacity', '.1');
      $('.gameOver').css('display', 'block');
      
      var scores = asteroidsManager.getScores();
      if(hsManager.check(scores.p1)){
        $('.gameOver').html(gameOverTmpl({player: "Player 1", score: scores.p1}));
      }
      else if(hsManager.check(scores.p2)){
        $('.gameOver').html(gameOverTmpl({player: "Player 2", score: scores.p2}));
      }
      else{
        $('.gameOver').html(gameOverTmpl({}));
      }
    }
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
