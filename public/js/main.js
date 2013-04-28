/*global console, require */

require.config({
    paths: {
        'jquery':     'lib/jquery',
        'underscore': 'lib/underscore',
        'backbone':   'lib/backbone',
        'tmpl':       'lib/tmpl'
    },

    shim: {
        'jquery': {
            deps: [],
            exports: '$'
        },

        'backbone': {
            deps: ['underscore', 'jquery'],
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
    // LOAD ALL THE MODELS
    var models = {
        bullet:   {},
        asteroid: {},
        player:   {},
        player2:  {}
    };

    var count = 4;

    var loader = new THREE.JSONLoader(false);

    loader.load('models/bullet.js', function (geometry, materials) {
        models.bullet.geometry = geometry;
        loadedModel();
    });

    loader.load('models/asteroid.js', function (geometry, materials) {
        models.asteroid.geometry = geometry;
        loadedModel();
    });

    loader.load('models/ship.js', function (geometry, materials) {
        models.player.geometry = geometry;
        loadedModel();
    });

    loader.load('models/enemy.js', function (geometry, materials) {
        models.player2.geometry = geometry;
        loadedModel();
    });

    models.asteroid.material = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('models/asteroid.jpg') });

    function loadedModel() {
        count--;
        if (count <= 0) {
            var main = new mainMenu();
            main.setModels(models);
            main.initGame();
            $('.wrapper').html(main.render().el);
        }
    }
});
