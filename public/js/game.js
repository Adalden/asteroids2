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

  var renderer
    , camera
    , scene
    , ship
    , enemy;

  var gameFlag  = false
    , pause     = false;

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

    gameFlag = true;

    options.scene = scene;
    asteroidsManager.init(options);

    options.asteroidsManager = asteroidsManager;
    bulletsManager.init(options);

    addShip('models/ship.js');
    addShip2('models/enemy.js');
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
    bulletsManager.addBullet(x, y, rot)
  }

  function addShip2(_model){
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
      enemy = mesh;
      player2.init({
        meshes:           [enemy, mesh2, mesh3, mesh4],
        updateFourMeshes: shared.updateFourMeshes,
        addBullet:        addBullet
      });
    });
  }

  function animate() {
    if(gameFlag){
      requestAnimationFrame(animate);
      if(!pause){
        asteroidsManager.update();
        bulletsManager.update();
        updatePlayer();
        updatePlayer2();
        render();
      }
    }
  }

  function stop(){
    gameFlag = false;
  }

  function updatePlayer() {
    if(inp.pause()){
      console.log("TEST");
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

    player.update();
  }

  function updatePlayer2() {
    if(inp.pause()){
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

    player2.update();
  }

  function render() {
    renderer.render(scene, camera);
  }

  function resume(){
    pause = false;
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
    if(playerOption == 1)

    //Two Players
    if(playerOption == 2){

    }

    //Player with ally
    if(playerOption == 3){

    }

    animate();
  }

  return {
    init:  init,
    start: start,
    stop: stop,
    resume: resume
  };
});
