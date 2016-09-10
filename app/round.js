//
// Spyout Round
//

var shuffle = require('knuth-shuffle').knuthShuffle;
var getNumberOfPlayersOnMission = require('./getNumberOfPlayersOnMission');

function Round(roundNumber, players, onEnd) {
	this.roundNumber = roundNumber;
	this.players = players;
	this.onEnd = onEnd;

	this.missionNumber = 0;
	this.missions = [];

	//add the five missions
	for (var i = 1; i <= 5; i++) {
		this.missions.push(new Mission(i));
	}
}

Round.prototype.start = function() {
	this.assignRoles();
	this.startSelectionPhase();
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

	this.assignNewCaptain();
}

Round.prototype.assignNewCaptain = function () {
	//get rid of the old captain with good old brute force
	for (var i = 0; i < this.players.length; i++) {
		this.players[i].isCaptain = false;
	}

	//check if everyone has been captain
	var playerCount = this.players.length;
	var hasBeenCaptainCount = 0;
	for (var i = 0; i < this.players.length; i++) {
		if (this.players[i].hasBeenCaptain) {
			hasBeenCaptainCount++;
		} else {
			break;
		}
	}

	//if everyone has been captain
	if (playerCount === hasBeenCaptainCount) {
		//remove the hasBeenCaptain so the game can pick
		//	a new captain
		for (var i = 0; i < this.players.length; i++) {
			this.players[i].hasBeenCaptain = false;
		}
	}

	//select a random player who has not yet been captain
	//	to be captain for this mission
	var indexOfCaptain;
	do {
		indexOfCaptain = Math.floor(Math.random() * this.players.length);
	}
	while (this.players[indexOfCaptain].hasBeenCaptain);

	this.players[indexOfCaptain].isCaptain = true;
	this.players[indexOfCaptain].hasBeenCaptain = true;
}

Round.prototype.startSelectionPhase = function () {
	this.missionNumber++;

	var missionPlayerCount = getNumberOfPlayersOnMission(this.players.length, this.missionNumber);
	var players = this.getJsonPlayers();

	this.sendToAll('startSelectionPhase', {
		missions: this.missions,
		missionNumber: this.missionNumber,
		missionPlayerCount,
		players
	});
};

Round.prototype.getJsonPlayers = function () {
	var players = [];
	this.players.forEach(function (player) {
		players.push(player.getJson());
	});
	return players;
}


function Mission(number) {
	this.number;
	this.whoWon = false;
}

module.exports = Round;
