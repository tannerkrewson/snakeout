import React, { Component } from "react";

import GetPlayer from "../utils/GetPlayer";
import CheckableButton from "./CheckableButton";

// props:
// players, list of players
// selectedPlayers, the players from the above list that should be checked
// onCheck, function that gets passed the player that was checked
export default class PlayerCheckboxes extends Component {
	render() {
		let evens = [];
		let odds = [];

		let players = this.props.players;

		for (let i = 0; i < players.length; i++) {
			//see if this player has been selected
			var playerIsSelected = !!GetPlayer.byId(
				this.props.selectedPlayers,
				players[i].id
			);

			var thisPlayerOnCheck = () => {
				if (this.props.onCheck) {
					this.props.onCheck(players[i]);
				}
			};

			let thisBox = (
				<CheckableButton
					checked={playerIsSelected}
					onCheck={thisPlayerOnCheck}
					key={i}
				>
					{players[i].name}
				</CheckableButton>
			);

			// fill two columns evenly
			if (i % 2 === 0) {
				evens.push(thisBox);
			} else {
				odds.push(thisBox);
			}
		}

		return (
			<div style={{ paddingBottom: "16px" }}>
				<div className="btn-group-vertical checkable-but">{evens}</div>
				{odds.length > 0 && (
					<div className="btn-group-vertical checkable-but">{odds}</div>
				)}
			</div>
		);
	}
}
