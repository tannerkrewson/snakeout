import React, { Component } from "react";
import SOButton from "../components/SOButton";
import RRButton from "../components/RRButton";
import JoinGame from "../components/JoinGame";
import NewGame from "../components/NewGame";
import Lobby from "../components/Lobby";
import Replace from "../components/Replace";

export default class MainMenu extends Component {
	render() {
		var goToJoinGame = function() {
			this.props.changePage(JoinGame);
		};
		var goToNewGame = function() {
			this.props.changePage(NewGame);
		};
		var goToHowToPlay = function() {
			window.location.href = "/how-to-play";
		};
		var goToMoreGames = function() {
			window.location.href = "/more-games";
		};
		var goToScreenshots = function() {
			window.location.href = "/screenshots";
		};

		var self = this;

		this.props.server.on("joinGame", function(data) {
			if (data.success) {
				self.props.changePage(Lobby, data.game);
				self.props.server.on("updatePlayerList", function(data) {
					self.props.changePage(Lobby, data.game);
				});
				gtag("event", "game_joined");
			} else {
				self.props.changePage(JoinGame);
				gtag("event", "game_join_failed");
			}
		});

		this.props.server.on("replace", function(data) {
			self.props.changePage(Replace, data);
		});

		return (
			<div className="main-menu noformrefresh">
				<div class="alert alert-dark soalert" role="alert">
					I've fixed the bug that caused missions to always fail. My apologies
					to anyone who has played before! The game should work now.
					<br />
					<br />
					To make up for this, I've updated Spyout with a new design and other
					fixes. :D
					<br />
					<br />
					Please email me at tannerkrewson@gmail.com if you find any other
					issues in the future. Thanks!
				</div>
				<p>
					<SOButton onClick={goToJoinGame.bind(this)}>Join Game</SOButton>
					<SOButton onClick={goToNewGame.bind(this)}>New Game</SOButton>
				</p>
				<div className="sogroup" role="group" aria-label="...">
					<RRButton isGroup={true} path="/how-to-play">
						How to Play
					</RRButton>
					<RRButton isGroup={true} path="/screenshots">
						Screenshots
					</RRButton>
					<RRButton isGroup={true} path="/more-games">
						Games Like Spyout
					</RRButton>
				</div>
				<br />
				<br />
			</div>
		);
	}
}
