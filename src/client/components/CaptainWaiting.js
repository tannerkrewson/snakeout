import React, { Component } from "react";

import PlayerCheckboxes from "./PlayerCheckboxes";
import PlayerList from "./PlayerList";
import RoundInfoBar from "./RoundInfoBar";

export default class CaptainWaiting extends Component {
	render() {
		var me = this.props.you;
		var data = this.props.round;
		return (
			<div className="waiting">
				<p>{this.props.message}</p>
				<PlayerCheckboxes
					players={data.players}
					selectedPlayers={data.captainsSelectedPlayers}
					disabled={true}
				/>
				<p>Players being waited on:</p>
				<PlayerList players={data.waitingList} />
				<RoundInfoBar round={data} me={me} />
			</div>
		);
	}
}
