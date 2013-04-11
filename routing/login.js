module.exports = function ( app ) {
	app.get('/login', function (req, res) {
		var data = {
			url: "/auth/github",
			name: "github-login"
		}
		app.render('login/login.html', data, function(err, html){
			res.json(
				{
					html: html,
					name: data.name
				}
				);
		});
	});

	// app.post('/register', function (req, res) {
	// 	var MD5 = require('MD5');
	// 	name = req.body.repo_name;
	// 	if ( name ){
	// 		//generate repo id
	// 		repo_id = MD5(name);
	// 		//check if repoid already exists
	// 		app.get('redis_client').hexists(repo_id, 'counter', function(err, exists){
	// 			if ( !exists ) {
	// 				//create a set for this repo
	// 				app.get('redis_client').hset(repo_id,  'counter', 0);
	// 				url = app.get('domain') + repo_id + '/counter'; 
	// 				var snippet = app.render('counter/snippet.html', { url: url}, function(err, html){
	// 					if (err) {
	// 						res.send(500, {message: 'rendering error.',  code: 500});
	// 					} else {
	// 						res.send(200, { message:'created.', id: repo_id, snippet: html, code: 200} );	
	// 					}
	// 				});
					
	// 			} else {
	// 				res.send(409, { message: 'already exists.',  code: 409} );
	// 			}
	// 		});	
	// 	} else {
	// 		res.send(500, { message: 'bad parameters.', code: 500} );
	// 	}
		
	// });
};