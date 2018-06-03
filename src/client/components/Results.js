import React, { Component } from "react";

import PlayerList from "./PlayerList";
import SOButton from "./SOButton";
import RoundInfoBar from "./RoundInfoBar";

export default class Results extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	doneViewingResults() {
		this.props.server.doneViewingResults();
	}
	render() {
		var me = this.props.you;
		var data = this.props.round;
		var currentMission = data.currentMission;

		var topMessage = "Mission " + currentMission.number;
		var bodyMessage = "";
		if (currentMission.status === "loyalist") {
			topMessage += " passed!";
		} else if (currentMission.status === "spy") {
			topMessage += " failed.";
		} else {
			console.log(
				"Results error A: mission status bad type: " + currentMission.status
			);
		}

		// figure out how many missions each team has to pass/fail before they win
		var passedMissionsToLoyalistWin = 3;
		var failedMissionsToSpyWin = 3;
		for (var i = 0; i < data.missions.length; i++) {
			var thisMission = data.missions[i];
			if (thisMission.status === "loyalist") {
				passedMissionsToLoyalistWin--;
			} else if (thisMission.status === "spy") {
				failedMissionsToSpyWin--;
			}
		}

		// count types of votes
		var passVotes = 0;
		var failVotes = 0;
		for (var i = 0; i < currentMission.missionVotes.length; i++) {
			var ballot = currentMission.missionVotes[i];
			if (ballot.vote) {
				passVotes++;
			} else {
				failVotes++;
			}
		}

		if (passedMissionsToLoyalistWin === 0) {
			// loyalists won
			topMessage = "Loyalists win!";
			bodyMessage +=
				"Spies needed " +
				failedMissionsToSpyWin +
				" more failing missions to win.\n";
		} else if (failedMissionsToSpyWin === 0) {
			// spies won
			topMessage = "Spies win!";
			bodyMessage +=
				"Loyalists needed " +
				passedMissionsToLoyalistWin +
				" more passing missions to win.\n";
		} else {
			bodyMessage +=
				"Loyalists need " +
				passedMissionsToLoyalistWin +
				" more passing missions to win.\n";
			bodyMessage +=
				"Spies need " +
				failedMissionsToSpyWin +
				" more failing missions to win.\n";
		}

		// if the game is over, reveal who was a spy
		var SpyList = <div />;
		if (passedMissionsToLoyalistWin === 0 || failedMissionsToSpyWin === 0) {
			//get this round's spies
			var spies = [];
			data.players.forEach(function(player) {
				if (player.isSpy) {
					spies.push(player);
				}
			});

			SpyList = (
				<div>
					<p className="so-h3">The spies this round were:</p>
					<PlayerList players={spies} />
				</div>
			);
		}

		return (
			<div className="selection-phase">
				<p className="so-h2">{topMessage}</p>
				<p className="so-h3">
					{passVotes + " pass votes | " + failVotes + " fail votes"}
				</p>
				<p className="so-h3">{bodyMessage}</p>
				{SpyList}
				<SOButton label="Next" onClick={this.doneViewingResults.bind(this)} />
				<RoundInfoBar round={data} me={me} />
			</div>
		);
	}
}
