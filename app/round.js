//
// Spyout Round
//

function Round(number, players, onResults, onEnd) {
	this.number = number;
	this.players = players;
	this.onResults = onResults;
	this.onEnd = onEnd;
}

Round.prototype.start = function() {
	//TODO: do some crazy shit
};

module.exports = Round;
