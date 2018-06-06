import React, { Component } from "react";

import SOInput from "./SOInput";
import SOButton from "./SOButton";

import MainMenu from "../pages/MainMenu";
import Loading from "../components/Loading";

export default class JoinGame extends Component {
	constructor(props) {
		super(props);
		this.state = {
			code: "",
			name: ""
		};
	}
	goToMainMenu() {
		this.props.changePage(MainMenu);
	}
	joinGame() {
		this.props.changePage(Loading);
		this.props.server.joinGame(this.state.code, this.state.name);
	}
	onGameCode(e) {
		let code = e.target.value;
		if (code.length <= 4) {
			this.setState({ code });
		}
	}
	onName(e) {
		let name = e.target.value;
		if (name.length <= 12) {
			this.setState({ name });
		}
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
						<SOInput
							onChange={this.onGameCode.bind(this)}
							autoFocus={true}
							value={this.state.code}
						/>
						<label>Enter your name:</label>
						<SOInput
							onChange={this.onName.bind(this)}
							value={this.state.name}
						/>
						<br />
						<SOButton onClick={this.goToMainMenu.bind(this)}>Back</SOButton>
						<SOButton isSubmit={true}>Join</SOButton>
						<br />
					</form>
				</div>
			</div>
		);
	}
}
