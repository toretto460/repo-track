
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

var usersByGhId = {};
var nextUserId = 0;

function addUser (source, sourceUser) {
  var user;
  if (arguments.length === 1) { // password-based
    user = sourceUser = source;
    user.id = ++nextUserId;
    return usersByGhId[nextUserId] = user;
  } else { // non-password-based
    user = usersByGhId[++nextUserId] = {id: nextUserId};
    user[source] = sourceUser;
  }
  return user;
}

everyauth.everymodule
  .findUserById( function (id, callback) {
    callback(null, usersByGhId[id]);
  });

//Github login
everyauth.github
  .appId(conf.github.appId)
  .appSecret(conf.github.appSecret)
  .callbackPath('/auth/github/callback')
  .findOrCreateUser( function (sess, accessToken, accessTokenExtra, ghUser) {
      return  [ghUser.id] || (usersByGhId[ghUser.id] = addUser('github', ghUser));
  })
  .redirectPath('/private');

app.configure(function(){
  var redis_client = redis.createClient();
  app.set('redis_client', redis_client);
  app.set('port', process.env.PORT || 80);
  app.set('domain', process.env.DOTCLOUD_WWW_HTTP_URL || 'http://localhost:8080/');
  app.set('views', __dirname + '/views');
  app.engine('html', require('hbs').__express);
  app.use(require('express').static(__dirname + '/public'));
  app.set('view engine', 'html');
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  
  app.use(express.cookieParser('hjdgasjhdff9237834bj'));
  app.use(express.cookieSession());
  app.use(everyauth.middleware());
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


var counter   = require('./routing/counter')(app)
  , register  = require('./routing/register')(app)
  , login     = require('./routing/login')(app) 
  , index     = require('./routing/index')(app)
  , private   = require('./routing/private')(app)  
  ;


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
