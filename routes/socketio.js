module.exports = function (app) {

	var io = app.io;
	var so = app.spyout;

	io.on('connection', function (socket) {
	  socket.on('newGame', function (data) {
	    var game = so.newGame();
			game.addPlayer(data.name, socket);
			socket.emit('joinGame', {
				code: game.code
			});
	  });
	});

}
