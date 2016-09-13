//
// Spyout Round
//

var Mission = require('./mission');

var shuffle = require('knuth-shuffle').knuthShuffle;
var getNumberOfPlayersOnMission = require('./getNumberOfPlayersOnMission');

function Round(roundNumber, players, onEnd) {
	this.roundNumber = roundNumber;
	this.players = players;
	this.playersBeingWaitedOn;
	this.onEnd = onEnd;
	this.onDoneWaiting;

	this.missionNumber = 0;
	this.missions = [];

	//add the five missions
	//i is the mission number
	for (var i = 1; i <= 5; i++) {
		var numPlayersForMission = getNumberOfPlayersOnMission(this.players.length, i);
		var newMission = new Mission(i, numPlayersForMission, this.players.length);
		this.missions.push(newMission);
	}
}

Round.prototype.startRound = function() {
	this.assignRoles();
	this.assignNewCaptain();
	this.startNextMission();
};

Round.prototype.startNextMission = function () {
	this.missionNumber++;

	//remove in progress from last mission, if there was a last mission
	if (this.missionNumber > 1) {
		var lastMission = this.missions[this.missionNumber - 2];
		lastMission.inProgress = false;
	}

	//set current mission in progress
	//subtract one because this.missions indexes start at 0
	var currentMission = this.getCurrentMission();
	currentMission.inProgress = true;

	this.startSelectionPhase();
}

Round.prototype.sendToAll = function (event, data) {
	this.players.forEach(function (player) {
		player.send(event, data);
	});
};

Round.prototype.onceOnAll = function (event, next) {
	this.players.forEach(function (player) {
		player.socket.once(event, function() {
			next(player);
		});
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

// the first phase of each mission
Round.prototype.startSelectionPhase = function () {
	this.sendToAll('startSelectionPhase', {
		missions: this.missions,
		currentMission: this.getCurrentMission(),
		missionNumber: this.missionNumber,
		players: this.getJsonPlayers()
	});
};

// called as a result of receiving the 'captainsSelectedPlayers'
// event from the captain
Round.prototype.startVotingPhase = function (selectedPlayers) {

	var thisMission = this.getCurrentMission();
	thisMission.potentialPlayersOnMission = selectedPlayers;

	// runs the processResultsOfVote function once everyone has voted
	thisMission.startVote(this.processResultsOfVote.bind(this));

	this.sendToAll('startVotingPhase', {
		potentialPlayersOnMission: thisMission.potentialPlayersOnMission,
		players: this.getJsonPlayers(),
		missions: this.missions,
		currentMission: this.getCurrentMission()
	});

	this.players.forEach(function(player) {
		player.socket.once('vote', function(data) {
			thisMission.addVote(player.id, data.vote);
		});
	});
}

Round.prototype.processResultsOfVote = function (wasVoteSuccessful) {
	if (wasVoteSuccessful) {
		var thisMission = this.getCurrentMission();
		thisMission.putSelectedPlayersOnTheMission();
		this.startMissionPhase();
	} else {
		// since the vote failed, we'll try the vote again with a new captain
		// to select players.
		// the spies win if the team votes fail 5 times in a row.
		this.assignNewCaptain();
		this.startSelectionPhase();
	}
}

Round.prototype.startMissionPhase = function() {
	var thisMission = this.getCurrentMission();

	// runs the processResultsOfVote function once everyone has voted
	thisMission.startMission(this.processResultsOfMission.bind(this));

	this.sendToAll('startMissionPhase', {
		missions: this.missions,
		currentMission: this.getCurrentMission(),
		missionNumber: this.missionNumber,
		players: this.getJsonPlayers()
	});

	this.players.forEach(function(player) {
		player.socket.once('missionVote', function(data) {
			thisMission.addMissionVote(player.id, data.vote);
		});
	});
}

Round.prototype.processResultsOfMission = function (wasMissionSuccessful) {
	if (wasMissionSuccessful) {
		// loyalists win this mission
		this.getCurrentMission().status = 'loyalist';
	} else {
		// spies win this mission
		this.getCurrentMission().status = 'spy';
	}

	var gameOver = this.checkForWin();

	// wait for everyone to be done viewing the results that
	// we are about to send
	var self = this;
	this.waitForAll(function() {
		// ran once everyone is done
		if (!gameOver) {
			self.assignNewCaptain();
			self.startNextMission();
		} else {
			// game over!
			self.onEnd();
		}
	});

	// send the results
	this.sendToAll('missionResults', {
		missions: this.missions,
		currentMission: this.getCurrentMission(),
		missionNumber: this.missionNumber,
		players: this.getJsonPlayers()
	});

	// ran when the passed player is done viewing results
	this.onceOnAll('doneViewingResults', function(player) {
		self.stopWaitingOn(player);
	});
}

Round.prototype.waitForAll = function (onDoneWaiting) {
	//make a copy of the players list
	this.playersBeingWaitedOn = this.players.slice();

	//this will be ran by stopWaitingOn once the waiting list is empty
	this.onDoneWaiting = onDoneWaiting;
}

// waitForAll must be ran once to set this function up
// this function then must be ran for every player
Round.prototype.stopWaitingOn = function (player) {
	// see if this player is in the waiting list
	var stillWaitingOnThisPlayer = false;
	var indexOfPlayer;
	for (var i = 0; i < this.playersBeingWaitedOn.length; i++) {
		var playerIdToCheck = this.playersBeingWaitedOn[i].id;
		if (player.id === playerIdToCheck) {
			stillWaitingOnThisPlayer = true;
			indexOfPlayer = i;
			break;
		}
	}

	if (stillWaitingOnThisPlayer) {
		//remove the player from the array
		this.playersBeingWaitedOn.splice(indexOfPlayer, 1);
	}

	//if we aren't waiting on any more players, continue with whatever
	if (this.playersBeingWaitedOn.length === 0) {
		this.onDoneWaiting();
		return;
	}

	// send the updated waiting list to all
	this.sendToAll('updateWaitingList', {
		waitingList: this.getJsonWaitingPlayers()
	});
}

Round.prototype.updateWaitingList = function () {
	this.sendToAll('updateWaitingList', {
		notFinished: this.getListOfNotFinishedPlayers(),
		disconnected: this.disconnectedPlayers
	});
};

Round.prototype.checkForWin = function() {
	var spyWins = 0;
	var loyalistWins = 0;
	for (var i = 0; i < this.missions.length; i++) {
		var thisMission = this.missions[i];
		if (thisMission.status === 'spy') {
			spyWins++;
		} else if (thisMission.status === 'loyalist') {
			loyalistWins++;
		}
	}
	if (spyWins === 3) {
		this.spyWin();
		return true;
	} else if (loyalistWins == 3) {
		this.loyalistWin();
		return true;
	} else {
		return false;
	}
}

Round.prototype.spyWin = function () {
	console.log('Spies win!');
}

Round.prototype.loyalistWin = function () {
	console.log('Loyalists win!');
}

Round.prototype.getJsonPlayers = function () {
	var players = [];
	this.players.forEach(function (player) {
		players.push(player.getJson());
	});
	return players;
}

Round.prototype.getJsonWaitingPlayers = function () {
	var players = [];
	this.playersBeingWaitedOn.forEach(function (player) {
		players.push(player.getJson());
	});
	return players;
}

Round.prototype.findReplacementFor = function (player) {

}

Round.prototype.getCurrentMission = function () {
	return this.missions[this.missionNumber - 1];
}


module.exports = Round;
