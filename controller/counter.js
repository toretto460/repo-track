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
      var repo_id = require('../manager/repo_manager').hashify(req.params.repoid);
      app.get('redis_client').hexists(repo_id, 'counter', function(err, exists){
        if ( exists ) { 
            app.get('redis_client').hget(repo_id, 'counter', function(err, value) {

                url = app.get('domain') + repo_id + '/counter';
                var snippet = app.render('counter/snippet.html', { url: url}, function(err, html){
                    if (err) {
                        res.send(500, {message: 'rendering error.',  code: 500});
                    } else {
                        res.json(200, { message:'created.', id: repo_id,'value': value, snippet: html} );
                    }
                });
            });
        } else {
          res.send(404);
        }
      });
  });
};