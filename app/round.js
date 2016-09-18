//
// Spyout Round
//

var Mission = require('./mission');

var shuffle = require('knuth-shuffle').knuthShuffle;
var getNumberOfPlayersOnMission = require('./getNumberOfPlayersOnMission');

function Round(roundNumber, players, onEnd) {
	this.roundNumber = roundNumber;
	this.players = players;
	this.onEnd = onEnd;
	this.onDoneWaiting;
	this.disconnectedPlayers = [];
	this.playersBeingWaitedOn = [];
	this.missionNumber = 0;
	this.missions = [];
	this.currentCaptain;
	this.phase = 'lobby';
	/* Phase List:
		lobby
		selection
		voting
		voting_results
		mission
		mission_results
	*/

	//add the five missions
	//i is the mission number
	for (var i = 1; i <= 5; i++) {
		var numPlayersForMission = getNumberOfPlayersOnMission(this.players.length, i);
		var newMission = new Mission(i, numPlayersForMission, this.players.length);
		this.missions.push(newMission);
	}
}

Round.prototype.getCurrentMission = function () {
	return this.missions[this.missionNumber - 1];
}

Round.prototype.changePhase = function (phase) {
	this.phase = phase;
}

Round.prototype.sendState = function (player) {
	player.send('updateState', this.getState());
}

Round.prototype.sendStateToAll = function () {
	var self = this;
	this.players.forEach(function (player) {
		self.sendState(player);
	});
};

Round.prototype.onceOnAll = function (event, next) {
	this.players.forEach(function (player) {
		player.socket.once(event, function() {
			next(player);
		});
	});
};

Round.prototype.getIndexOfPlayerOnWaitingList = function (player) {
	for (var i = 0; i < this.playersBeingWaitedOn.length; i++) {
		var playerIdToCheck = this.playersBeingWaitedOn[i].id;
		if (player.id === playerIdToCheck) {
			return i;
		}
	}
	return -1;
}

Round.prototype.removePlayerFromWaitingList = function (player) {
	// see if this player is in the waiting list
	var indexOfPlayer = this.getIndexOfPlayerOnWaitingList(player);

	if (indexOfPlayer > -1) {
		//remove the player from the array
		this.playersBeingWaitedOn.splice(indexOfPlayer, 1);
		return true;
	}
	return false;
}

Round.prototype.waitFor = function (playersToWaitOn, eventToWaitFor, onPlayerDone, onAllDone) {
	this.playersBeingWaitedOn = playersToWaitOn.slice();

	if (!eventToWaitFor) {
		eventToWaitFor = 'done';
	}

	// if the inputed player list does not have sockets attached,
	// we get 'em because we need 'em
	if (!this.playersBeingWaitedOn[0].socket) {
		this.playersBeingWaitedOn = this.getPlayerListWithSockets(this.playersBeingWaitedOn);
	}

	var self = this;
	this.playersBeingWaitedOn.forEach(function (player) {
		player.socket.once(eventToWaitFor, function (data) {

			self.removePlayerFromWaitingList(player);

			//if the onPlayerDone function was passed, run it
			if (onPlayerDone) {
				onPlayerDone(player, data);
			}

			//if we aren't waiting on any more players, continue with whatever
			if (onAllDone && self.playersBeingWaitedOn.length === 0) {
				onAllDone();
			}
		});
	});
}

Round.prototype.onDone = function () {

}

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
	if (spyWins === 3 || loyalistWins === 3) {
		return true;
	} else {
		return false;
	}
}

Round.prototype.getJsonPlayersOf = function (oldPlayerList) {
	var newPlayersList = [];
	oldPlayerList.forEach(function (player) {
		if (player.getJson) {
			newPlayersList.push(player.getJson());
		} else {
			newPlayersList.push(player);
		}
	});
	return newPlayersList;
}

Round.prototype.getJsonPlayers = function () {
	return this.getJsonPlayersOf(this.players);
}

Round.prototype.getJsonWaitingPlayers = function () {
	return this.getJsonPlayersOf(this.playersBeingWaitedOn);
}

Round.prototype.getJsonDisconnectedPlayers = function () {
	return this.getJsonPlayersOf(this.disconnectedPlayers);
}

Round.prototype.findReplacementFor = function (player) {
	this.disconnectedPlayers.push(player);
	var indexOfPlayer = this.getIndexOfPlayerOnWaitingList(player);

	// if the player is not currently being waited on by the server
	if (indexOfPlayer === -1) {
		this.playersBeingWaitedOn.push(player);
	}

	this.sendStateToAll();
};

Round.prototype.canBeReplaced = function (playerToReplaceId) {
	for (var i = 0; i < this.disconnectedPlayers.length; i++) {
		if (this.disconnectedPlayers[i].id === playerToReplaceId) {
			return true;
		}
	}
	return false;
};

Round.prototype.replacePlayer = function (playerToReplaceId, name, socket) {
	for (var i = 0; i < this.disconnectedPlayers.length; i++) {
		var playerToReplace = this.disconnectedPlayers[i];
		if (playerToReplace.id === playerToReplaceId) {
			playerToReplace.name = name;

			// copy the event listeners from the old socket to the new one
			// i'd like to say that i came up with this all by myself saving
			// what could have been hours of work to come up with a different
			// solution. ✌️
			socket._events = playerToReplace.socket._events;

			playerToReplace.replaceConnection(socket);

			this.removePlayerFromWaitingList(playerToReplace);

			//delete the player from from disconnectedPlayers
			this.disconnectedPlayers.splice(i, 1);

			this.sendStateToAll();
		}
	}
};

Round.prototype.getPlayersThatNeedToBeReplaced = function () {
	return this.disconnectedPlayers;
};

Round.prototype.getPlayerIndexById = function (id) {
	for (var i = 0; i < this.players.length; i++) {
		if (this.players[i].id === id) {
			return i;
		}
	}
	return false;
};

Round.prototype.getPlayerListWithSockets = function (jsonPlayerList) {
	var newPlayersList = [];
	var self = this;
	jsonPlayerList.forEach(function (jsonPlayer) {
		var realPlayerIndex = self.getPlayerIndexById(jsonPlayer.id);
		if (realPlayerIndex > -1) {
			newPlayersList.push(self.players[realPlayerIndex]);
		} else {
			console.log('getPlayerListWithSockets error: invalid index');
		}
	});
	return newPlayersList;
};

Round.prototype.getState = function () {
	var currentMission = this.getCurrentMission();
	return {
		currentMission,
		disconnectedList: this.getJsonDisconnectedPlayers(),
		missions: this.missions,
		phase: this.phase,
		players: this.getJsonPlayers(),
		potentialPlayersOnMission: currentMission.potentialPlayersOnMission,
		waitingList: this.getJsonWaitingPlayers()
	};
}

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

	this.currentCaptain = this.players[indexOfCaptain];
}


Round.prototype.startRound = function() {
	this.assignRoles();
	this.assignNewCaptain();
	this.prepNextMission(true);
	this.showStartPage();
};

Round.prototype.prepNextMission = function () {
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
}

Round.prototype.showStartPage = function () {
	this.changePhase('start');

	// what the parameters do:
	// (playersToWaitOn, eventToWaitFor, onPlayerDone, onAllDone)
	// *all done is not used b/c it is handled in the mission object
	var self = this;
	this.waitFor(this.players, 'doneViewingStart', function(player, data) {
		//ran everytime a player hits next
		self.sendStateToAll();
	}, function() {
		//ran once everyone is ready to start
		self.startSelectionPhase();
	});

	this.sendStateToAll();
}

// the first phase of each mission
Round.prototype.startSelectionPhase = function () {
	this.changePhase('selection');

	// this list is only going to contain one player, but I do it because
	// waitFor requires an array of players
	var captainList = [this.currentCaptain];

	// what the parameters do:
	// (playersToWaitOn, eventToWaitFor, onPlayerDone, onAllDone)
	// *all done is not used b/c it is handled in the mission object
	var self = this;
	this.waitFor(captainList, 'captainsSelectedPlayers', function(player, data) {
		// ran once the captain has selected players
		self.startVotingPhase(data.selectedPlayers);
	});

	this.sendStateToAll();
};

// called as a result of receiving the 'captainsSelectedPlayers'
// event from the captain
Round.prototype.startVotingPhase = function (selectedPlayers) {

	var thisMission = this.getCurrentMission();
	thisMission.potentialPlayersOnMission = selectedPlayers;

	// runs the processResultsOfVote function once everyone has voted
	thisMission.startVote(this.processResultsOfVote.bind(this));

	this.changePhase('voting');
	this.sendStateToAll();

	// what the parameters do:
	// (playersToWaitOn, eventToWaitFor, onPlayerDone, onAllDone)
	// *all done is not used b/c it is handled in the mission object
	var self = this;
	this.waitFor(this.players, 'selectionVote', function (player, data) {
		// ran when a single player's vote is submitted
		thisMission.addVote(player.id, data.vote);
		self.sendStateToAll();
	});
}

Round.prototype.processResultsOfVote = function (wasVoteSuccessful) {

	var thisMission = this.getCurrentMission();

	// wait for everyone to be done viewing the results that
	// we are about to send
	var self = this;
	this.waitFor(this.players, 'doneViewingVoteResults', function () {
		// ran everytime a player hits next
		self.sendStateToAll();
	}, function () {
		// ran once, once everyone is done
		if (wasVoteSuccessful) {
			thisMission.putSelectedPlayersOnTheMission();
			self.startMissionPhase();
		} else {
			// since the vote failed, we'll try the vote again with a new captain
			// to select players.
			// the spies win if the team votes fail 5 times in a row.
			self.assignNewCaptain();
			self.startSelectionPhase();
		}
	});

	//send the results
	this.changePhase('voting_results');
	this.sendStateToAll();
}

Round.prototype.startMissionPhase = function() {
	var thisMission = this.getCurrentMission();

	// runs the processResultsOfVote function once everyone has voted
	thisMission.startMission(this.processResultsOfMission.bind(this));

	// what the parameters do:
	// (playersToWaitOn, eventToWaitFor, onPlayerDone, onAllDone)
	// *onAllDone is not used because it is handled in the mission object
	var self = this;
	this.waitFor(thisMission.playersOnMission, 'missionVote', function (player, data) {
		//ran when a single player is done
		thisMission.addMissionVote(player.id, data.vote);
		self.sendStateToAll();
	});

	this.changePhase('mission');
	this.sendStateToAll();
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
	this.waitFor(this.players, 'doneViewingResults', function () {
		// ran everytime a player hits next
		self.sendStateToAll();
	}, function () {
		// ran once everyone is done
		if (!gameOver) {
			self.assignNewCaptain();
			self.prepNextMission();
			self.startSelectionPhase();
		} else {
			// game over!
			self.onEnd();
		}
	});

	// send the results
	this.changePhase('mission_results');
	this.sendStateToAll();
}

module.exports = Round;
