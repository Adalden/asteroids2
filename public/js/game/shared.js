define([], function () {
  var WIDTH
    , HEIGHT;

  function init(options) {
    WIDTH  = options.WIDTH  || 1440;
    HEIGHT = options.HEIGHT || 700;
  }

  function collides(obj1, obj2) {
    var m2 = obj1.position;
    var dist2 = obj1.geometry.boundingSphere.radius * obj1.scale.x;

    var m1 = obj2.position;
    var dist = dist2 + obj2.geometry.boundingSphere.radius * obj2.scale.x;

    var d = Math.sqrt(Math.pow(m1.x - m2.x, 2) + Math.pow(m1.y - m2.y, 2) + Math.pow(m1.z - m2.z, 2));

    return d <= dist;
  }

  function checkBounds(mesh) {
    if (mesh.position.x < -WIDTH / 2)  mesh.position.x += WIDTH;
    if (mesh.position.x >  WIDTH / 2)  mesh.position.x -= WIDTH;
    if (mesh.position.y < -HEIGHT / 2) mesh.position.y += HEIGHT;
    if (mesh.position.y >  HEIGHT / 2) mesh.position.y -= HEIGHT;
  }

  function updateFourMeshes(meshes) {
    meshes[1].position.y = meshes[0].position.y;
    meshes[1].position.z = meshes[0].position.z;
    if (meshes[0].position.x > 0)
      meshes[1].position.x = meshes[0].position.x - WIDTH;
    else
      meshes[1].position.x = meshes[0].position.x + WIDTH;

    meshes[2].position.x = meshes[0].position.x;
    meshes[2].position.z = meshes[0].position.z;
    if (meshes[0].position.y > 0)
      meshes[2].position.y = meshes[0].position.y - HEIGHT;
    else
      meshes[2].position.y = meshes[0].position.y + HEIGHT;

    meshes[3].position.z = meshes[0].position.z;
    if (meshes[0].position.x > 0)
      meshes[3].position.x = meshes[0].position.x - WIDTH;
    else
      meshes[3].position.x = meshes[0].position.x + WIDTH;
    if (meshes[0].position.y > 0)
      meshes[3].position.y = meshes[0].position.y - HEIGHT;
    else
      meshes[3].position.y = meshes[0].position.y + HEIGHT;
  }

  return {
    init:             init,
    collides:         collides,
    checkBounds:      checkBounds,
    updateFourMeshes: updateFourMeshes
  };

});
