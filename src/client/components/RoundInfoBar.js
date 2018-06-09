import React, { Component } from "react";

import MissionBar from "./MissionBar";
import RoleViewer from "./RoleViewer";
import GameCode from "./GameCode";

export default class RoundInfoBar extends Component {
	render() {
		var me = this.props.me;
		var round = this.props.round;
		var ourRole = this.props.me.isSpy ? "spy" : "loyalist";

		const twoFailNotice = round.players.length >= 7;

		return (
			<div className="round-info-bar">
				<br />
				<hr />
				<p>Missions:</p>
				<MissionBar missions={round.missions} />
				{twoFailNotice && (
					<div className="card border-light bg-transparent text-white mb-3">
						<div className="card-body">
							<p className="card-text">
								Because this game has 7 or more players, the 4th mission will
								require two fails to fail, instead of just one. So, if just one
								player fails the 4th mission, the mission will still be won by
								the loyalists.
							</p>
						</div>
					</div>
				)}
				<p />
				<RoleViewer role={ourRole} players={round.players} me={me} />
				<p />
				<p>
					{round.players.length - round.spyCount} loyalists | {round.spyCount}{" "}
					spies
				</p>
				<GameCode code={round.gameCode} />
			</div>
		);
	}
}
