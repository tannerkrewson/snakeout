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
			attachInGameListeners(socket, so, game);
	  });

		socket.on('joinGame', function (data) {
			var game = so.findGame(data.code);
			if (game) {
				game.addPlayer(data.name, socket);
				socket.emit('joinGame', {
					success: true,
					game: game.getJsonGame()
				});
				attachInGameListeners(socket, so, game);
			} else {
				socket.emit('joinGame', {
					success: false
				});
			}
	  });

	});
}

function attachInGameListeners(socket, so, game) {

	socket.on('startGame', function(data) {
		game.startIfReady();
	});

	socket.on('captainsSelectedPlayers', function(data) {
		game.startVotingPhase(data.selectedPlayers);
	});

}
