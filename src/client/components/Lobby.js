import React, { Component } from "react";

import GameCode from "./GameCode";
import PlayerList from "./PlayerList";
import SOButton from "./SOButton";

export default class Lobby extends Component {
	render() {
		var gameCode = this.props.code;
		var numPlayersInLobby = this.props.players.length;

		var startGame = () => {
			this.props.server.startGame(gameCode);
			gtag("event", "game_start", {
				number_of_players: numPlayersInLobby
			});
		};

		// display how many more players are needed to start the game
		var playersNeededMessage = "";
		var notReady = false;
		if (numPlayersInLobby < 5) {
			var numPlayersNeeded = 5 - numPlayersInLobby;
			var s = numPlayersNeeded === 1 ? "" : "s";
			playersNeededMessage = numPlayersNeeded + " more player" + s + " needed";
			notReady = true;
		} else if (numPlayersInLobby > 10) {
			var numPlayersNeedToLeave = numPlayersInLobby - 10;
			var s1 = numPlayersNeedToLeave === 1 ? "" : "s";
			var s2 = s1 === "s" ? "" : "s";
			playersNeededMessage =
				numPlayersInLobby - 10 + " player" + s1 + " need" + s2 + " to leave";
			notReady = true;
		}

		return (
			<div className="lobby">
				<GameCode code={this.props.code} />
				<p>Players:</p>
				<PlayerList players={this.props.players} />
				<p>{playersNeededMessage}</p>
				<div>
					<SOButton
						label="Leave Game"
						onClick={() => {
							this.props.server.socket.close();
						}}
					/>
					<SOButton
						label="Start Game"
						onClick={startGame}
						disabled={notReady}
					/>
				</div>
				<br />
			</div>
		);
	}
}
