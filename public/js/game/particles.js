define([], function () {

  return {
    init:   initEffects,
    create: createExplosion,
    update: updateParticles
  };
});

var PARTICLE_COUNT  = 1200
  , PARTICLE_SPREAD = 10;

var systems     = []
  , systemCount = 0;

function createExplosion(x, y) {
  resetSystem(systems[systemCount], x, y);
  if (++systemCount >= systems.length) systemCount = 0;
}

function initEffects(scene) {
  // create explosions
  for (var i = 0; i < 3; ++i) {
    var system  = createSystem(PARTICLE_COUNT,     PARTICLE_SPREAD,     0xFFAA00);
    var system2 = createSystem(PARTICLE_COUNT / 2, PARTICLE_SPREAD / 2, 0xFF0000);
    scene.add(system);
    scene.add(system2);
    systems.push([system, system2]);
  }
}

function createSystem(count, spread, color) {
  var particles = new THREE.Geometry()
    , pMaterial = new THREE.ParticleBasicMaterial({
        color: color,
        opacity: 0,
        size: 20,
        map: THREE.ImageUtils.loadTexture('/img/particle.png'),
        blending: THREE.AdditiveBlending,
        transparent: true
      });

  for (var p = 0; p < count; p++) {
    var particle = new THREE.Vector3(0, 0, 0);
    particle.velocity = new THREE.Vector3(0, 0, 0);
    particles.vertices.push(particle);
  }

  var particleSystem = new THREE.ParticleSystem(particles, pMaterial);
  particleSystem.position.z = -50;
  particleSystem.spread = spread;
  particleSystem.sortParticles = true;

  return particleSystem
}

function resetSystem(system, x, y) {
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
}

function resetParticle(particle, spread) {
  var rot = Math.random() * 360;
  particle.x = particle.y = 0;
  particle.velocity.x = (Math.random() - .5) * spread * Math.sin(rot);
  particle.velocity.y = (Math.random() - .5) * spread * Math.cos(rot);
}

function updateParticles() {
  for (var i = 0; i < systems.length; ++i) {
    for (var j = 0; j < systems[i].length; ++j) {
      if (systems[i][j].material.opacity <= 0) continue;
      systems[i][j].material.opacity -= .01;
      var pCount = systems[i][j].geometry.vertices.length;
      while (pCount--) {
        var particle = systems[i][j].geometry.vertices[pCount];
        particle.addSelf(particle.velocity);
      }
      systems[i][j].geometry.__dirtyVertices = true;
    }
  }
}
