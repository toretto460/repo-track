
/**
 * Module dependencies.
 */

var express = require('express')
  , counter = require('./routing/counter').counter
  , register = require('./routing/register').register
  , redis = require('./lib/redistogo')
  , http = require('http')
  , path = require('path')
  , Canvas = require('canvas');

var app = express();
var redis_client = redis.createClient();


app.configure(function(){
  app.set('port', process.env.PORT || 8080);
  app.set('views', __dirname + '/views');
  app.engine('html', require('hbs').__express);
  app.use(require('express').static(__dirname + '/public'));
  app.set('view engine', 'html');
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser('hjdgasjhdff9237834bj'));
  app.use(express.cookieSession());
  //app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.post('/register', register.save);
app.get('/register', register.new);
app.get('/:repoid/counter', counter.count);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
