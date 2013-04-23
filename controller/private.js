var github = require("../lib/github_api");

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
			splash_form: "/private/repo-getter"
		}
		res.render('layout/base.html', data);
	});
	
	app.get('/private/repo-getter', function (req, res) {
		app.render('private/repos.html', {}, function(err, html){
			res.json(
				{
					html: html,
					name: "repo-list"
				}
				);
		});
	});

	app.get('/private/repos', function(req, res){

			github.repos.getFromUser({
			    user: req.session.auth.github.user.login
			}, function(err, data) {
				if(err){
					console.log(err);
				} else {
					res.json(data);
				}
			});
		
	});


};