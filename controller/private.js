var github = require("../lib/github_api");
var route_prefix = 'private';

module.exports = function ( app ) {

  var checkUser = function(req, res, next){
  	if (!req.session.auth) {
  		res.send(403);
  	} else {
  		next();
  	}	
  };

	app.all('/private*', checkUser);

    app.get('/'+ route_prefix, function (req, res) {
    user = req.session.auth.github.user.name;
		var data = {
			user: user,
			splash_form: "/private/repo-getter"
		}
		res.render('layout/base.html', data);
	});
	
	app.get('/'+ route_prefix +'/repo-getter', function (req, res) {
		app.render('private/repos.html', {}, function(err, html){
			res.json(
				{
					html: html,
					name: "repo-list"
				}
				);
		});
	});

	app.get('/'+ route_prefix +'/repos', function(req, res){

			github.api.repos.getFromUser({
			    user: req.session.auth.github.user.login
			}, function(err, data) {
				if(err){
					console.log(err);
				} else {
					console.log(data);
					for(var el in data){
						console.log(el);
					}
					res.json(data);
				}
			});
		
	});


};