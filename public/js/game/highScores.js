define([], function () {
var highScores;

function init(scores){
  highScores = scores;
}

function check(thisScore){
  for(var n = 0; n < highScores.length; ++n)
    if(thisScore > highScores[n].score)
      return true;

  return false;
}

function save(name, score){
  var temp = [];
  var flag = false;
  for(var n = 0; n < highScores.length; ++n){
    if(score > highScores[n].score && !flag){
      temp.push({name: name, score: score});
      flag = true;
    }
    temp.push(highScores[n]);
  }

  temp.pop();
  highScores = temp;
}

function get(){
  return highScores;
}
  
  return {
    init:     init,
    check:    check,
    save:     save,
    get:      get,
  };

});