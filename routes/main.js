module.exports = function (app) {

	var so = app.spyout;

	app.get('/', function (req, res) {
		res.render('index', {});
	});

}
