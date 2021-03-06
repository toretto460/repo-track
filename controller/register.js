var repo_model = require('../model/repo');

module.exports = function ( app ) {

	app.get('/register', function (req, res) {
		if (req.session.auth) {
      user = req.session.auth.github.user.login;
			var data = {
				url: "/register",
				name: "repo-save",
				user: user
			}

			app.render('register/new_repo.html', data, function(err, html){
				res.json(
					{
						html: html,
						name: data.name
					}
					);
			});
		} else {
			res.send(404, 'Please Login!');
		}
	});

	app.post('/register', function (req, res) {
		var repo_manager = require('../manager/repo_manager');
		name = req.body.repo_name;
		if ( name ){
			//generate repo id
			repo_id = repo_manager.hashify(name);
			//check if repoid already exists
			app.get('redis_client').hexists(repo_id, 'counter', function(err, exists){
				if ( !exists ) {
					//create a set for this repo
					app.get('redis_client').hmset(repo_id,  repo_model);

					url = app.get('domain') + repo_id + '/counter'; 
					var snippet = app.render('counter/snippet.html', { url: url}, function(err, html){
						if (err) {
							res.send(500, {message: 'rendering error.',  code: 500});
						} else {
							res.send(200, { message:'created.', id: repo_id, snippet: html, code: 200} );	
						}
					});
					
				} else {
					res.send(409, { message: 'already exists.',  code: 409} );
				}
			});	
		} else {
			res.send(500, { message: 'bad parameters.', code: 500} );
		}
		
	});
};