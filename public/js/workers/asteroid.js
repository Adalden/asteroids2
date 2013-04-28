var WIDTH  = 1440
  , HEIGHT = 700;

onmessage = function (event) {
  var data = event.data;

  for (var i = 0; i < data.length; ++i) {
    data[i].x += data[i].dx;
    data[i].y += data[i].dy;

    data[i].rotx += data[i].drotx;
    data[i].roty += data[i].droty;

    checkBounds(data[i]);
    updateFourMeshes(data[i]);
  }

  postMessage(data);
};

function checkBounds(data) {
  if (data.x < -WIDTH / 2)  data.x += WIDTH;
  if (data.x >  WIDTH / 2)  data.x -= WIDTH;
  if (data.y < -HEIGHT / 2) data.y += HEIGHT;
  if (data.y >  HEIGHT / 2) data.y -= HEIGHT;
}

function updateFourMeshes(data) {
  data.meshes = [
    { x: data.x, y: data.y},
    { x: data.x, y: data.y},
    { x: data.x, y: data.y}
  ];

  if (data.x > 0)
    data.meshes[0].x -= WIDTH;
  else
    data.meshes[0].x += WIDTH;

  if (data.y > 0)
    data.meshes[1].y -= HEIGHT;
  else
    data.meshes[1].y += HEIGHT;

  if (data.x > 0)
    data.meshes[2].x -= WIDTH;
  else
    data.meshes[2].x += WIDTH;

  if (data.y > 0)
    data.meshes[2].y -= HEIGHT;
  else
    data.meshes[2].y += HEIGHT;
}
