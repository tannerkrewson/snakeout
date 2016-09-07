module.exports = function (app) {

	var io = app.io;
	var so = app.spyout;

	io.on('connection', function (socket) {
	  socket.on('newGame', function (data) {
	    var game = so.newGame();
			game.addPlayer(data.name, socket);
			socket.emit('joinGame', {
				success: true,
				code: game.code
			});
	  });
		socket.on('joinGame', function (data) {
			console.log('Game!');
			var game = so.findGame(data.code);
			if (game) {
				game.addPlayer(data.name, socket);
				socket.emit('joinGame', {
					success: true,
					code: game.code
				});
			} else {
				socket.emit('joinGame', {
					success: false
				});
			}
	  });
	});

}
