import React, { Component } from "react";

import RoleViewer from "./RoleViewer";
import MissionBar from "./MissionBar";
import PlayerList from "./PlayerList";
import SOButton from "./SOButton";

export default class StartPage extends Component {
	doneViewingStart() {
		this.props.server.doneViewingStart();
	}
	render() {
		var me = this.props.you;
		var data = this.props.round;

		var ourRole = me.isSnake ? "snake" : "loyalist";

		return (
			<div className="round-info-bar">
				<p className="so-h2">Welcome to Snakeout!</p>
				<RoleViewer role={ourRole} players={data.players} me={me} />
				<br />
				<p>Missions:</p>
				<MissionBar missions={data.missions} />
				<br />
				<p>Players:</p>
				<PlayerList players={data.players} />
				<p>
					{data.players.length - data.snakeCount} loyalists | {data.snakeCount}{" "}
					spies
				</p>
				<SOButton onClick={this.doneViewingStart.bind(this)}>Begin</SOButton>
			</div>
		);
	}
}
