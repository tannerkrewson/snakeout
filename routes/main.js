module.exports = function (app) {

	var so = app.spyout;

	app.get('/', function (req, res) {
		res.render('index', {});
	});

	if (app.get('env') === 'development') {
		app.get('/dev', function (req, res) {
			res.render('index', {});
		});
	}

}
