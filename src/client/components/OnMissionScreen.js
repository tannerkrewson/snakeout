import React, { Component } from "react";

import PlayerList from "./PlayerList";
import SOButton from "./SOButton";

export default class OnMissionScreen extends Component {
	voteYay() {
		this.props.server.missionVote(true);
	}
	voteNay() {
		this.props.server.missionVote(false);
	}
	render() {
		var me = this.props.you;
		var data = this.props.round;
		var currentMission = data.currentMission;

		// data.players is all of the players in the game
		// currentMission.playersOnMission is only the players on the mission

		return (
			<div className="on-mission-screen">
				<p className="so-h3">
					You are on mission
					<span> {currentMission.number} </span>
					with:
				</p>
				<PlayerList players={currentMission.playersOnMission} />
				<p>All players must pass this mission for it to succeed.</p>
				<p>This mission will fail even if just one player fails it.</p>
				<p>The other players will not know how you voted.</p>
				<div>
					<SOButton label="Fail" onClick={this.voteNay.bind(this)} />
					<SOButton label="Pass" onClick={this.voteYay.bind(this)} />
				</div>
			</div>
		);
	}
}
