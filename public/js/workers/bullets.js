var WIDTH  = 1440
  , HEIGHT = 700;

onmessage = function (event) {
  var data = event.data;

  for (var i = 0; i < data.length; ++i) {
    data[i].x += data[i].dx;
    data[i].y -= data[i].dy;
    data[i].life -= 20;

    checkBounds(data[i]);
  }

  postMessage(data);
};

function checkBounds(data) {
  if (data.x < -WIDTH / 2)  data.x += WIDTH;
  if (data.x >  WIDTH / 2)  data.x -= WIDTH;
  if (data.y < -HEIGHT / 2) data.y += HEIGHT;
  if (data.y >  HEIGHT / 2) data.y -= HEIGHT;
}
