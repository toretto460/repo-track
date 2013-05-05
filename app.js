
/**
 * Module dependencies.
 */

var express = require('express')
  , redis = require('./lib/redistogo')
  , http = require('http')
  , path = require('path')
  , app = express()
  , everyauth = require('everyauth')
  , conf = require('./config/config')
  ;

//Managers 
var user_manager = require('./manager/user_manager');
user_manager.connect(app, everyauth, conf);

app.configure(function(){
  var redis_client = redis.createClient();
  app.set('redis_client', redis_client);
  app.set('port', process.env.PORT || 8080);
  app.set('domain', process.env.WWW_HTTPS_URL || 'http://localhost:8080/');
  app.set('views', __dirname + '/views');
  app.engine('html', require('hbs').__express);
  app.use(require('express').static(__dirname + '/public'));
  app.set('view engine', 'html');
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  
  app.use(express.cookieParser('hjdgasjhdff9237834bj'));
  app.use(express.cookieSession());
  app.use(everyauth.middleware(app));
});

app.configure('development', function(){
  app.use(express.errorHandler());
  app.use(require('./lib/dev/user_fixture').user_logged_in);
});

//Controllers
var counter   = require('./controller/counter')(app)
  , register  = require('./controller/register')(app)
  , login     = require('./controller/login')(app) 
  , index     = require('./controller/index')(app)
  , priv      = require('./controller/private')(app)
  ;


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
