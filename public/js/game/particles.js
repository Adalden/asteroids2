define([], function () {

  return {};
});


  function createExplosion(x, y) {
    var particleCount = 1800
      , particles = new THREE.Geometry()
      , pMaterial = new THREE.ParticleBasicMaterial({
          color: 0xFF0000,
          size: 20,
          map: THREE.ImageUtils.loadTexture('/img/particle.png'),
          blending: THREE.AdditiveBlending,
          transparent: true
        });

    for(var p = 0; p < particleCount; p++) {
      var particle = new THREE.Vector3(0, 0, 0);

      particle.velocity = new THREE.Vector3(
        Math.random() - .5,
        Math.random() - .5,
        Math.random() - .5
      );

      particles.vertices.push(particle);
    }

    var particleSystem = new THREE.ParticleSystem(particles, pMaterial);
    particleSystem.sortParticles = true;

    scene.add(particleSystem);

    function updateParticles() {
      var pCount = particleCount;
      while (pCount--) {
        var particle = particles.vertices[pCount];
        particle.position.addSelf(particle.velocity);
      }

      particleSystem.geometry.__dirtyVertices = true;
    }
  }
