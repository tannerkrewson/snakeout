import React, { Component } from "react";

import SOInput from "./SOInput";
import SOButton from "./SOButton";

import MainMenu from "../pages/MainMenu";

export default class JoinGame extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	goToMainMenu() {
		this.props.changePage(MainMenu);
	}
	joinGame() {
		this.props.server.joinGame(this.state.code, this.state.name);
	}
	onGameCode(code) {
		this.setState({ code });
	}
	onName(name) {
		this.setState({ name });
	}
	onFormSubmit(event) {
		event.preventDefault();
		this.joinGame();
	}
	render() {
		return (
			<div className="row">
				<div className="col-sm-6 offset-sm-3 col-8 offset-2">
					<form className="join-menu" onSubmit={this.onFormSubmit.bind(this)}>
						<label>Enter the game code:</label>
						<SOInput onChange={this.onGameCode.bind(this)} autoFocus={true} />
						<label>Enter your name:</label>
						<SOInput onChange={this.onName.bind(this)} />
						<br />
						<SOButton label="Back" onClick={this.goToMainMenu.bind(this)} />
						<SOButton isSubmit={true} label="Join" />
						<br />
					</form>
				</div>
			</div>
		);
	}
}
