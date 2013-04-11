module.exports = function ( app ) {
	app.get('/private', function (req, res) {
		if (req.session.auth) {
      user = req.session.auth.github.user.name;
			var data = {
				user: user,
				splash_form: "/register"
			}
			res.render('layout/base.html', data);
		} else {
			res.send(404, 'Please Login!');
		}
	});
};