define([], function () {

  return {
    init:                initEffects,
    update:              updateParticles,
    createExplosion:     createExplosion,
    createPropulsion:    createPropulsion,
    createPropulsion2:   createPropulsion2,
    createAsteroidParts: createAsteroidParts
  };
});

var PARTICLE_COUNT  = 1200
  , PARTICLE_SPREAD = 10;

var systems     = [];

var explosions      = []
  , explosionsCount = 0;

var prop1, prop2;

var asteroidParts      = []
  , asteroidPartsCount = 0;

function createExplosion(x, y) {
  resetExplosion(explosions[explosionsCount], x, y);
  if (++explosionsCount >= explosions.length) explosionsCount = 0;
}

function createPropulsion(x, y, rot) {
  resetPropulsion(prop1, x, y, rot, 60);
}

function createPropulsion2(x, y, rot) {
  resetPropulsion(prop2, x, y, rot, 20);
}

function createAsteroidParts(x, y, rot) {
  resetAsteroidParts(asteroidParts[asteroidPartsCount], x, y, rot);
  if (++asteroidPartsCount >= asteroidParts.length) asteroidPartsCount = 0;
}

function resetPropulsion(system, x, y, rot, aoeu) {
  system.material.opacity = 1;
  system.position.x = x - Math.sin(rot) * aoeu;
  system.position.y = y + Math.cos(rot) * aoeu;
  system.rotation.z = rot;
}

function initEffects(scene) {
  // create explosions
  for (var i = 0; i < 3; ++i) {
    var system  = createSystem(PARTICLE_COUNT,   0xFFAA00, { spread: PARTICLE_SPREAD });
    var system2 = createSystem(PARTICLE_COUNT/2, 0xFF0000, { spread: PARTICLE_SPREAD/2 });
    scene.add(system);
    scene.add(system2);

    var explosion = [system, system2];
    explosions.push(explosion);
    systems.push(explosion);
  }

  // create asteroid explosion
  for (var i = 0; i < 10; ++i) {
    var system = createSystem(PARTICLE_COUNT/2, 0x00FF00, { spread: PARTICLE_SPREAD }); // RGB(130, 126, 99)
    scene.add(system);
    asteroidParts.push(system);
    systems.push([system]);
  }

  // create propulsion
  prop1 = createSystem(PARTICLE_COUNT / 16, 0xFFAA00, { xRange: 25, initialVelocityY: 10, maxVelocityY: 100, burnOut: .1 });
  scene.add(prop1);
  systems.push([prop1]);

  prop2 = createSystem(PARTICLE_COUNT / 16, 0xFFAA00, { xRange: 25, initialVelocityY: 10, maxVelocityY: 100, burnOut: .1 });
  scene.add(prop2);
  systems.push([prop2]);
}

function createSystem(count, color, options) {
  var particles = new THREE.Geometry()
    , pMaterial = new THREE.ParticleBasicMaterial({
        color: color,
        opacity: 0,
        size: 10,
        map: THREE.ImageUtils.loadTexture('/img/particle.png'),
        blending: THREE.AdditiveBlending,
        transparent: true,
        sizeAttenuation: false
      });

  for (var p = 0; p < count; p++) {
    var particle = new THREE.Vector3(0, 0, 0);
    particle.velocity = new THREE.Vector3(0, 0, 0);

    if (options.xRange) {
      particle.x = (Math.random() - .5) * options.xRange;
    }

    if (options.initialVelocityY) {
      particle.velocity.y = Math.random() * options.initialVelocityY;
      particle.yLimit = options.maxVelocityY + Math.random() * 50;
    }

    particles.vertices.push(particle);
  }

  var particleSystem = new THREE.ParticleSystem(particles, pMaterial);
  particleSystem.position.z = -50;
  particleSystem.sortParticles = true;

  if (options.spread)  particleSystem.spread  = options.spread;
  if (options.burnOut) particleSystem.burnOut = options.burnOut;

  return particleSystem;
}

function resetAsteroidParts(system, x, y, rot) {
  var particles = system.geometry;
  var spread = system.spread;
  var pCount = particles.vertices.length;

  while (pCount--) {
    var particle = particles.vertices[pCount];
    resetParticle(particle, pCount % 2 === 0);
  }

  system.material.opacity = 1;
  system.position.x = x;
  system.position.y = y;

  function resetParticle(particle, odd) {
    particle.x = particle.y = 0;
    var vel = Math.random() - .5

    if (odd) {
      var rot2 = (Math.random() - .5) * 10 + rot;
      particle.velocity.x = vel * spread * -Math.sin(rot2);
      particle.velocity.y = vel * spread * Math.cos(rot2);
    } else {
      var rot2 = (Math.random() - .5) * Math.PI/18 + rot;
      particle.velocity.x = vel * spread * 2 * -Math.sin(rot2);
      particle.velocity.y = vel * spread * 2 * Math.cos(rot2);
    }
  }
}

function resetExplosion(system, x, y) {
  for (var i = 0; i < system.length; ++i) {
    var particles = system[i].geometry;
    var spread = system[i].spread;
    var pCount = particles.vertices.length;

    while (pCount--) {
      var particle = particles.vertices[pCount];
      resetParticle(particle, spread);
    }

    system[i].material.opacity = 1;
    system[i].position.x = x;
    system[i].position.y = y;
  }

  function resetParticle(particle, spread) {
    var rot = Math.random() * 360;
    particle.x = particle.y = 0;
    particle.velocity.x = (Math.random() - .5) * spread * Math.sin(rot);
    particle.velocity.y = (Math.random() - .5) * spread * Math.cos(rot);
  }
}

function updateParticles() {
  for (var i = 0; i < systems.length; ++i) {
    for (var j = 0; j < systems[i].length; ++j) {
      if (systems[i][j].material.opacity <= 0) continue;
      systems[i][j].material.opacity -= systems[i][j].burnOut || .01;
      var pCount = systems[i][j].geometry.vertices.length;
      while (pCount--) {
        var particle = systems[i][j].geometry.vertices[pCount];
        particle.addSelf(particle.velocity);

        if (particle.yLimit && particle.y > particle.yLimit) {
          particle.y = 0;
        }
      }
      systems[i][j].geometry.__dirtyVertices = true;
    }
  }
}
