exports.register = {
	"new" : function (req, res) {
		var data = {
			url: "/register/save",
			default_timeout: '10'
		}
		res.render('forms/new-repo.html', data);
	},
	"save" : function (req, res) {
		res.send('registration save need to be implemented');
		res.end();
	}
};