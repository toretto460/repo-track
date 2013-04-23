module.exports = function ( app ) {
	app.get('/', function (req, res) {
		var data = {
			splash_form: "/login"
		}
		res.render('layout/base.html', data);
	});
};