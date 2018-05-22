module.exports = function (app) {

	var so = app.spyout;

	app.get('/', function (req, res) {
		res.render('index', {});
	});

	app.get('/how-to-play', function (req, res) {
		res.render('how-to-play', {});
	});

	app.get('/more-games', function (req, res) {
		res.render('more-games', {});
	});


	app.get('/screenshots', function (req, res) {
		res.render('screenshots', {});
	});


	if (app.get('env') === 'development') {
		app.get('/dev', function (req, res) {
			res.render('index', {});
		});
	}

}
