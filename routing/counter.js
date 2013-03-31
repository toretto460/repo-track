var Canvas = require('canvas');

module.exports = function(app) {

  app.get('/:repoid/counter', function(req, res){

    var repo_id = req.params.repoid;
    var cookie = req.cookies.repo_track;

    if( !cookie ){
      app.get('redis_client').hexists(repo_id, 'counter', function(err, exists){
        if ( exists ) {
          app.get('redis_client').hincrby(repo_id, 'counter', 1, function(err, value) {
            res.cookie('repo_track', { viewed: 1 }, { expires: new Date(Date.now() + (60*60*60)) });
            canvas = new Canvas(50,20);
            ctx = canvas.getContext('2d');
            ctx.font = '20px Verdana';
            ctx.fillText(value, 0, 15);
            res.send(canvas.toBuffer());
          });
        }
      });
    }
  });
};