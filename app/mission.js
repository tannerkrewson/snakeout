//
// Spyout Mission
//

function Mission(number, playersNeeded, numberOfPlayersInTheGame) {
	this.number = number;
	this.playersNeeded = playersNeeded;
	this.status = false;
	this.numberOfPlayersInTheGame = numberOfPlayersInTheGame;

	this.potentialPlayersOnMission = [];
	this.votes = [];
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


function Vote(playerId, vote) {
	this.playerId = playerId;
	this.vote = vote;
}

module.exports = Mission;
