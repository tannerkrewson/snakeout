module.exports = function (app) {

	var so = app.spyout;

	app.get('/', function (req, res) {
		res.render('index', {});
	});

	app.get('/how-to-play', function (req, res) {
		res.render('howtoplay', {});
	});

	if (app.get('env') === 'development') {
		app.get('/dev', function (req, res) {
			res.render('index', {});
		});
	}

}
