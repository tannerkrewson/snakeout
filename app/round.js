//
// Spyout Round
//

function Round(roundNumber, players, onEnd) {
	this.roundNumber = roundNumber;
	this.players = players;
	this.onEnd = onEnd;
}

Round.prototype.start = function() {
	//TODO: do some crazy shit
};

Round.prototype.sendToAll = function (event, data) {
	this.players.forEach(function (player) {
		player.send(event, data);
	});
};

module.exports = Round;
