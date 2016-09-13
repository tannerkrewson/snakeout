//
// Spyout Mission
//

function Mission(number, playersNeeded, numberOfPlayersInTheGame) {
	this.number = number;
	this.playersNeeded = playersNeeded;
	this.status = false;
	this.numberOfPlayersInTheGame = numberOfPlayersInTheGame;

	this.potentialPlayersOnMission = [];
	this.playersOnMission = [];
	this.votes = [];
	this.missionVotes = [];

	this.allPlayerVoted;
	this.allPlayersMissionVoted;
}

Mission.prototype.startVote = function (onAllPlayersVoted) {
	this.onAllPlayersVoted = onAllPlayersVoted;
	this.votes = [];
}

// vote: true=approve; false=reject;
Mission.prototype.addVote = function (playerId, vote) {
	this.votes.push(new Vote(playerId, vote));

	//once all of the players vote
	if (this.numberOfPlayersInTheGame === this.votes.length) {
		//check if the vote was successful
		var wasVoteSuccessful;
		var approveCount = 0;
		var rejectCount = 0;
		for (var i = 0; i < this.votes.length; i++) {
			if (this.votes[i].vote) {
				approveCount++;
			} else {
				rejectCount++;
			}
		}

		// if there is a tie, the vote fails
		if (approveCount > rejectCount) {
			wasVoteSuccessful = true;
		} else {
			wasVoteSuccessful = false;
		}

		this.onAllPlayersVoted(wasVoteSuccessful);
	}
}

Mission.prototype.putSelectedPlayersOnTheMission = function() {
	// takes the potentialPlayersOnMission and makes them the
	// actual playersOnMission
	this.playersOnMission = this.potentialPlayersOnMission;
	this.potentialPlayersOnMission = [];
}

Mission.prototype.startMission = function (onAllPlayersMissionVoted) {
	this.onAllPlayersMissionVoted = onAllPlayersMissionVoted;
	this.votes = [];
}

// vote: true=approve; false=reject;
Mission.prototype.addMissionVote = function (playerId, vote) {
	this.missionVotes.push(new Vote(playerId, vote));

	//once all of the players vote
	if (this.playersOnMission.length === this.missionVotes.length) {
		//check if the vote was successful
		var wasVoteSuccessful;
		var approveCount = 0;
		var rejectCount = 0;
		for (var i = 0; i < this.missionVotes.length; i++) {
			if (this.missionVotes[i].vote) {
				approveCount++;
			} else {
				rejectCount++;
			}
		}

		//TODO: Add cases for missions that need two rejects to fail
		if (rejectCount === 0) {
			wasVoteSuccessful = true;
		} else {
			wasVoteSuccessful = false;
		}

		this.onAllPlayersMissionVoted(wasVoteSuccessful);
	}
}

function Vote(playerId, vote) {
	this.playerId = playerId;
	this.vote = vote;
}

module.exports = Mission;
