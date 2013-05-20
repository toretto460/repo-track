var Canvas = require('canvas'),
    fs     = require('fs');

module.exports = function(app) {

  app.get('/:repoid/counter', function(req, res){

    var repo_id = req.params.repoid;
    var cookie = req.cookies.repo_track;

    var sendCanvas = function (res, value) {
      res.cookie('repo_track', { viewed: 1 }, { expires: new Date(Date.now() + (30*24*60*60*1000)) });
        fs.readFile(__dirname + '/../public/images/base.png', function(err, squid){
            if (err) throw err;
            canvas = new Canvas(80,20);
            ctx = canvas.getContext('2d');
            img = new Canvas.Image;
            img.src = squid;
            ctx.drawImage(img, 0, 0, img.width, img.height);
            ctx.font = '12px Verdana';
            ctx.fillStyle = 'rgb(255,255,255,1)';
            ctx.fillText(value, 0, 14);
            ctx.font = '10px Verdana';
            ctx.fillText('visits', 33, 12);
            res.send(canvas.toBuffer());
        });

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