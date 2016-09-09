module.exports = function (app) {

	var io = app.io;
	var so = app.spyout;

	io.on('connection', function (socket) {
	  socket.on('newGame', function (data) {
	    var game = so.newGame();
			game.addPlayer(data.name, socket);
			socket.emit('joinGame', {
				success: true,
				game: game.getJsonGame()
			});
	  });
		socket.on('joinGame', function (data) {
			var game = so.findGame(data.code);
			if (game) {
				game.addPlayer(data.name, socket);
				socket.emit('joinGame', {
					success: true,
					game: game.getJsonGame()
				});
			} else {
				socket.emit('joinGame', {
					success: false
				});
			}
	  });
	});

}
