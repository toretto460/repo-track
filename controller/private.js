var GitHubApi = require("github"),
		github 		= new GitHubApi({
		// required
    version: "3.0.0",
    // optional
    timeout: 5000,
    // debug required
    debug: true
		});

module.exports = function ( app ) {

  var checkUser = function(req, res, next){
  	console.log(req.session.auth);
  	if (!req.session.auth) {
  		res.send(403);
  	} else {
  		next();
  	}	
  };

	app.all('/private*', checkUser);

	app.get('/private', function (req, res) {
    user = req.session.auth.github.user.name;
		var data = {
			user: user,
			splash_form: "/register"
		}
		res.render('layout/base.html', data);
	});

	app.get('/private/repos', function(req, res){

			github.repos.getFromUser({
			    user: req.session.auth.github.user.login
			}, function(err, data) {
			    res.json(data);
			});
		
	});


};