var Canvas = require('canvas');

module.exports = function(app) {

  app.get('/:repoid/counter', function(req, res){

    var repo_id = req.params.repoid;
    var cookie = req.cookies.repo_track;

    var sendCanvas = function (res, value) {
      res.cookie('repo_track', { viewed: 1 }, { expires: new Date(Date.now() + (30*24*60*60*1000)) });
      canvas = new Canvas(50,20);
      ctx = canvas.getContext('2d');
      ctx.font = '20px Verdana';
      ctx.fillText(value, 0, 15);
      res.send(canvas.toBuffer());  
    };  

      app.get('redis_client').hexists(repo_id, 'counter', function(err, exists){

        if ( exists ) { 
          if ( !cookie ) {    
            app.get('redis_client').hincrby(repo_id, 'counter', 1, function(err, value) {
              sendCanvas(res, value);
            });
          } else {
            app.get('redis_client').hget(repo_id, 'counter', function(err, value) {
              sendCanvas(res, value);
            });
          }
        } else {
          res.send(404);
        }
      });
  });

  app.get('/:repoid/raw', function(req, res){

      app.get('redis_client').hexists(repo_id, 'counter', function(err, exists){
        if ( exists ) { 
            app.get('redis_client').hget(repo_id, 'counter', function(err, value) {
              res.json({'value': value});
            });
        } else {
          res.send(404);
        }
      });
  });
};