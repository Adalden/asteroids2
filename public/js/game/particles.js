define([], function () {
  return {
    create: createExplosion,
    update: updateParticles
  };
});

var particles = new THREE.Geometry()
  , isSystem = false
  , particleSystem;

function createExplosion(scene) {
  var particleCount = 1800
    , pMaterial = new THREE.ParticleBasicMaterial({
        color: 0xFF0000,
        size: 20,
        map: THREE.ImageUtils.loadTexture('/img/particle.png'),
        blending: THREE.AdditiveBlending,
        transparent: true
      });

  for (var p = 0; p < particleCount; p++) {
    var particle = new THREE.Vector3(0, 0, 0);

    particle.velocity = new THREE.Vector3(
      Math.random() - .5,
      Math.random() - .5,
      Math.random() - .5
    );

    particles.vertices.push(particle);
  }

  particleSystem = new THREE.ParticleSystem(particles, pMaterial);
  particleSystem.sortParticles = true;

  scene.add(particleSystem);
  isSystem = true;
}

function updateParticles() {
  if (!isSystem) return;

  var pCount = 1800;
  while (pCount--) {
    var particle = particles.vertices[pCount];
    particle.addSelf(particle.velocity);
  }
  particleSystem.geometry.__dirtyVertices = true;
}
