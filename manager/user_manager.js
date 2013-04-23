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

exports.connect = function(app, everyauth, conf) {
	//Listen the user save event
  app.on('event:user:save', function(data){
  	addUser('github', data);
  });

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
	      app.emit('event:user:save', ghUser);
	      return  [ghUser.id] || (usersByGhId[ghUser.id] = addUser('github', ghUser));
	  })
	  .redirectPath('/private');
};
