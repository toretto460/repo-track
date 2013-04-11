module.exports = function ( app ) {
	
	app.get('*', function(req, res){
		console.log('redirect' + "https://" + req.headers["host"] + req.url);
		res.redirect("https://" + req.headers["host"] + req.url);
	});
};
