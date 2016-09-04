//
// Spyout Round
//

var shuffle = require('knuth-shuffle').knuthShuffle;

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

Round.prototype.getNumberOfSpies = function() {
	var numOfPlayers = this.players.length;
	if (numOfPlayers === 5 || numOfPlayers === 6) {
		return 2;
	} else if (numOfPlayers >= 7 || numOfPlayers <= 9) {
		return 3;
	} else if (numOfPlayers === 10) {
		return 4;
	} else {
		//this should not be reached
		console.log('Error: bad number of players: ' + numOfPlayers);
		return false;
	}
}

Round.prototype.assignRoles = function() {
	var numOfSpies = this.getNumberOfSpies();

	//shuffle the players in place so that the same
	//	people are not spies everytime
	shuffle(this.players);

	for (var i = 0; i < this.players.length; i++) {
		if (numOfSpies > 0) {
			this.players[i].isSpy = true;
			numOfSpies--;
		} else {
			this.players[i].isSpy = false;
		}
	}

	//one random player will be leader
	var indexOfLeader = Math.floor(Math.random() * this.players.length);
	this.players[indexOfLeader].isLeader = true;

}

module.exports = Round;
