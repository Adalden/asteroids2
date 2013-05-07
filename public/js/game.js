define([
  'game/input',
  'game/input2',
  'game/player',
  'game/asteroidsManager',
  'game/bulletsManager',
  'game/shared',
  'game/particles',
  'game/player2',
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
  particles,
  player2,
  enemy,
  hsManager,
  gSettingsTmpl,
  gameOverTmpl
) {
  var WIDTH
    , HEIGHT;

  var player1model
    , player2model
    , enemyModel;

  var renderer
    , camera
    , scene
    , ship
    , ship2
    , enemyShip;

  var sounds = {}
    , soundFlag = true;

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

  function createSounds() {
    sounds.fire     = new Howl({ urls: ['./snd/fire.mp3'] });
    sounds.explode  = new Howl({ urls: ['./snd/explode.mp3'] });
    sounds.gameOver = new Howl({ urls: ['./snd/notinmyhouse.mp3'] });
    sounds.asteroid = new Howl({ urls: ['./snd/asteroidBreak.mp3'] });
    sounds.thruster = new Howl({ urls: ['./snd/thruster.mp3'], loop: true });
  }

  function init(options) {
    WIDTH  = options.WIDTH  || 1440;
    HEIGHT = options.HEIGHT || 700;

    createSounds();
    shared.init(options);
    createWebWorkers();

    var NEAR = 0.1
      , FAR  = 10000;

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
    particles.init(scene);
    asteroidsManager.init(options);
    bulletsManager.init(options);

    addShip(player, player1model, ship);
  }

  function createWebWorkers() {
    // asteroidsManager.update(event.data);

    asteroidWorker = (function () {
      var listener;
      var myWorker = new Worker('/js/workers/asteroid.js');
      myWorker.onmessage = function (event) {
        if (listener) listener(event.data);
      };

      return {
        postMessage: function (data, cb) {
          myWorker.postMessage(data);
          listener = cb;
        }
      }
    }());

    playerWorker = (function () {
      var listener;
      var myWorker = new Worker('/js/workers/asteroid.js');
      myWorker.onmessage = function (event) {
        if (listener) listener(event.data);
      };

      return {
        postMessage: function (data, cb) {
          myWorker.postMessage(data);
          listener = cb;
        }
      }
    }());

    player2Worker = (function () {
      var listener;
      var myWorker = new Worker('/js/workers/asteroid.js');
      myWorker.onmessage = function (event) {
        if (listener) listener(event.data);
      };

      return {
        postMessage: function (data, cb) {
          myWorker.postMessage(data);
          listener = cb;
        }
      }
    }());

    bulletsWorker = (function () {
      var listener;
      var myWorker = new Worker('/js/workers/bullets.js');
      myWorker.onmessage = function (event) {
        if (listener) listener(event.data);
      };

      return {
        postMessage: function (data, cb) {
          myWorker.postMessage(data);
          listener = cb;
        }
      }
    }());

    // playerWorker = new Worker('/js/workers/asteroid.js');
    // playerWorker.onmessage = function (event) {
    //   player.update(event.data[0]);
    // };

    // player2Worker = new Worker('/js/workers/asteroid.js');
    // player2Worker.onmessage = function (event) {
    //   player2.update(event.data[0]);
    // };

    // bulletsWorker = new Worker('/js/workers/bullets.js');
    // bulletsWorker.onmessage = function (event) {
    //   bulletsManager.update(event.data);
    // };
  }

  function addShip(thePlayer, theModel, theGlobal){
    var mesh  = new THREE.Mesh(theModel.geometry, theModel.material);
    var mesh2 = new THREE.Mesh(theModel.geometry, theModel.material);
    var mesh3 = new THREE.Mesh(theModel.geometry, theModel.material);
    var mesh4 = new THREE.Mesh(theModel.geometry, theModel.material);

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
    theGlobal = mesh;

    thePlayer.init({
      meshes:           [mesh, mesh2, mesh3, mesh4],
      updateFourMeshes: shared.updateFourMeshes,
      addBullet:        addBullet,
      invincible:       false
    });
  }

  function addBullet(x, y, rot, playerNum) {
    bulletsManager.addBullet(x, y, rot, playerNum);
  }

  function animate() {
    if (gameFlag) {
      requestAnimationFrame(animate);
      if (!pause) {
        var THREADCOUNT = 2;
        if (player1Flag) ++THREADCOUNT;
        if (player2Flag) ++THREADCOUNT;

        asteroidWorker.postMessage(asteroidsManager.getAsteroidData(), function (data) {
          asteroidsManager.update(data);
          done();
        });

        if (player1Flag) {
          updatePlayer(inp, player, '.p1');
          playerWorker.postMessage(player.getPlayerData(), function (data) {
            player.update(data[0]);
            done();
          });
        }
        if (player2Flag) {
          updatePlayer(inp2, player2, '.p2');
          player2Worker.postMessage(player2.getPlayerData(), function (data) {
            player2.update(data[0]);
            done();
          });
        }

        bulletsWorker.postMessage(bulletsManager.getBulletData(), function (data) {
          bulletsManager.update(data);
          done();
        });

        enemy.update();
        particles.update();

        isGameOver();

        function done() {
          if (--THREADCOUNT === 0) {
            bulletsManager.checkCollisions(asteroidsManager, function (x, y, rot) {
              particles.createAsteroidParts(x, y, rot);
              sounds.asteroid.play();
            });
            render();
          }
        }
      }
    }
  }

  function stop() {
    gameFlag = false;
  }

  function updatePlayer(theInput, thePlayer, theExtension) {
    if (theInput.pause()) {
      pause = true;
      showOptions();
    }

    if (theInput.up()) {
      var theMesh = thePlayer.get();
      thePlayer.accelerate();

      if (theExtension === '.p1')
        particles.createPropulsion(theMesh.position.x, theMesh.position.y, theMesh.rotation.y);
      else
        particles.createPropulsion2(theMesh.position.x, theMesh.position.y, theMesh.rotation.y);

      if (!sounds.thruster.isPlaying && soundFlag) {
        sounds.thruster.play();
        sounds.thruster.isPlaying = true;
      }
    } else {
      sounds.thruster.isPlaying = false;
      sounds.thruster.stop();
    }

    if (theInput.left()) {
      thePlayer.turnLeft();
    }

    if (theInput.right()) {
      thePlayer.turnRight();
    }

    if (theInput.fire()) {
      thePlayer.fire();
      if(soundFlag)
        sounds.fire.play();
    }
    if (thePlayer.getInvincible())
      thePlayer.addTime();
    else
      checkPlayerCollision(thePlayer, theExtension);
  }

  function checkPlayerCollision(shipObj, playerStr) {
    var mahShip = shipObj.get();

    if (asteroidsManager.checkShip(mahShip) || bulletsManager.checkEnemyCollision(mahShip)) {
      particles.createExplosion(mahShip.position.x, mahShip.position.y);
      if(soundFlag)
        sounds.explode.play();

      if (playerStr == ".p1") {
        if (p1Lives > 0) {
          player.setInvincible();
          --p1Lives;
        }
        if (p1Lives <= 0) {
          player1Flag = false;
          scene.remove(mahShip);
        }
        $('.p1.lives').html("Lives: " + p1Lives);
      }
      if (playerStr == ".p2") {
        if (p2Lives > 0) {
          player2.setInvincible();
          --p2Lives;
        }
        if (p2Lives <= 0) {
          player2Flag = false;
          scene.remove(mahShip);
        }
        $('.p2.lives').html("Lives: " + p2Lives);
      }
    }
  }

  function render() {
    renderer.render(scene, camera);
  }

  function resume() {
    if (pause)
      pause = false;
    if (gameFlag)
      gameFlag = true;
  }

  function showOptions() {
    $('.ingameOptions').html(gSettingsTmpl());
    $('.ingameOptionsOverlay').css('display', 'block');
  }

  function start(playerOption, p1Controls, p2Controls) {
    inp.set(p1Controls);
    inp2.set(p2Controls);
    addShip(enemy, enemyModel, enemyShip);

    //One Player
    if (playerOption == 1) {
      player2Flag = false;
      player.setInvincible();
    }

    //Two Players
    if (playerOption == 2) {
      addShip(player2, player2model, ship2);
      $('.p2').css('display', 'block');
      player.setInvincible();
      player2.setInvincible();
    }

    animate();
  }

  function isGameOver() {
    if (player1Flag == false && player2Flag == false) {
      gameFlag = false;
      setTimeout(function () {
        if(soundFlag)
          sounds.gameOver.play();
      }, 1000);

      $('.gameOverOverlay').css('display', 'block');
      $('.death').css('display', 'none');

      var scores = asteroidsManager.getScores();
      if (hsManager.check(scores.p1)) {
        $('.gameOver').html(gameOverTmpl({ player: "Player 1", score: scores.p1 }));
      } else if(hsManager.check(scores.p2)) {
        $('.gameOver').html(gameOverTmpl({ player: "Player 2", score: scores.p2 }));
      } else {
        $('.gameOver').html(gameOverTmpl({}));
      }
    }
  }

  function setModels(models) {
    player1model = models.player;
    player2model = models.player2;
    enemyModel = models.enemy;
    asteroidsManager.setModels(models);
    bulletsManager.setModels(models);
  }

  return {
    init:      init,
    start:     start,
    stop:      stop,
    setModels: setModels,
    resume:    resume,
    setFX:     function(option){soundFlag = option;}
  };
});
