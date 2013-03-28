
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , redis = require('./lib/redistogo')
  , path = require('path')
  , Canvas = require('canvas');

var app = express();
var redis_client = redis.createClient();


app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('hjdgasjhdff9237834bj'));
  app.use(express.cookieSession());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/counter/:repoid',function (req, res) {

  var repo_id = req.params.repoid;
  var cookie = req.cookies.repo_track;

  if( true ){
    redis_client.exists(req.params.repoid, function(err, exists){
      if ( !exists ) {
        redis_client.set(repo_id,0);
      }
      redis_client.incr(repo_id, function(err, value) {
        console.log(value);
        res.cookie('repo_track', { viewed: 1 }, { expires: new Date(Date.now() + (60*60*60)) });
        canvas = new Canvas(200,200);
        ctx = canvas.getContext('2d');
        ctx.font = '30px Impact';
        ctx.fillText(value, 50, 100);
        var te = ctx.measureText(value);
        ctx.strokeStyle = 'rgba(0,0,0,0.5)';
        ctx.beginPath();
        ctx.lineTo(50, 102);
        ctx.lineTo(50 + te.width, 102);
        ctx.stroke();
        res.send(canvas.toBuffer());
        res.end();
      });
    });
  } else {
    res.end();
  }
})

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
