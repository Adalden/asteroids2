/*global console, require */

require.config({
  paths: {
    jquery:     'lib/jquery',
    underscore: 'lib/underscore',
    backbone:   'lib/backbone',
    tmpl:       'lib/tmpl'
  },
  shim: {
    jquery: {
      deps:    [],
      exports: '$'
    },
    backbone: {
      deps:    ['underscore', 'jquery'],
      exports: 'Backbone'
    }
  }
});

require([
  'jquery',
  'views/gameManager',
], function (
  $,
  mainMenu
) {
  // setup all the models
  var models = {
    bullet:   { url: 'models/bullet.js',   hasFour: false },
    asteroid: { url: 'models/asteroid.js', hasFour: true  },
    player:   { url: 'models/ship.js',     hasFour: true  },
    player2:  { url: 'models/ship2.js',    hasFour: true  },
    enemy:    { url: 'models/enemy.js',    hasFour: true  }
  };

  // load the models
  loadModels(models, function () {
    var main = new mainMenu();
    main.setModels(models);
    main.initGame();
    $('.wrapper').html(main.render().el);
  });
});


// helper function
function loadModels(models, cb) {
  var loader = new THREE.JSONLoader(false);

  // set the count
  var count = 1;
  for (var key in models) ++count;

  // load all the models
  for (var key in models) {
    (function (myModel) {
      loader.load(myModel.url, function (geometry, materials) {
        myModel.geometry = geometry;
        done();
      });
    }(models[key]));
  }

  // load all the materials
  models.asteroid.material = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('models/asteroid.jpg') });
  models.player.material   = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('models/c1_01_02_01_04.jpg') });
  models.player2.material  = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('models/c3_12.jpg') });
  models.enemy.material    = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('models/_Vinyl_Gray_3.jpg') });
  models.bullet.material   = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('models/bullet.jpg') })
  done();

  // provide async capability
  function done() {
    if (--count === 0) cb();
  }
}
