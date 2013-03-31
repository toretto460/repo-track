
/**
 * Module dependencies.
 */

var express = require('express')
  , redis = require('./lib/redistogo')
  , http = require('http')
  , path = require('path')
  , app = express();

app.configure(function(){
  var redis_client = redis.createClient();
  app.set('redis_client', redis_client);
  app.set('port', process.env.PORT || 8080);
  app.set('domain', process.env.DOTCLOUD_WWW_HTTP_URL || 'http://localhost:8080/');
  app.set('views', __dirname + '/views');
  app.engine('html', require('hbs').__express);
  app.use(require('express').static(__dirname + '/public'));
  app.set('view engine', 'html');
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser('hjdgasjhdff9237834bj'));
  app.use(express.cookieSession());
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var counter = require('./routing/counter')(app)
  , register = require('./routing/register')(app);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
