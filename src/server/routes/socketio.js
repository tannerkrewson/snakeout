module.exports = function (app) {

	var io = app.io;
	var so = app.spyout;

	io.on('connection', function (socket) {

		var player;

	  socket.on('newGame', function (data) {
	    var game = so.newGame();
			player = game.addPlayer(data.name, socket);
			socket.emit('joinGame', {
				success: true,
				game: game.getJsonGame()
			});
			attachInGameListeners(so, game, player);
	  });

		socket.on('joinGame', function (data) {
			var game = so.findGame(data.code);

			// if the game exists and is not in progress
			if (game && !game.inProgress)
			{
				player = game.addPlayer(data.name, socket);
				socket.emit('joinGame', {
					success: true,
					game: game.getJsonGame()
				});
				attachInGameListeners(so, game, player);
			}
			// if the game is in progress and disconnected players need to be replaced
			else if (game.inProgress && game.currentRound.disconnectedPlayers.length > 0)
			{
				var thisRound = game.currentRound;
				socket.emit('replace', thisRound.getState());
				socket.on('tryReplace', function (data_2) {
					var id = data_2.playerIdToReplace;
					var canBeReplaced = thisRound.canBeReplaced(id);
					if (canBeReplaced) {
						thisRound.replacePlayer(id, data.name, socket);
					}
				});
			}
			else
			{
				socket.emit('joinGame', {
					success: false
				});
			}
	  });

	});
}

function attachInGameListeners(so, game, player) {

	var socket = player.socket;

	socket.on('startGame', function(data) {
		game.startIfReady();
	});

	socket.on('getState', function(data) {
		var thisRound = game.currentRound;
		thisRound.sendState(player);
	});

}
