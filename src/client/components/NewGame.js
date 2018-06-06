import React, { Component } from "react";

import SOInput from "./SOInput";
import SOButton from "./SOButton";

import MainMenu from "../pages/MainMenu";
import Loading from "../components/Loading";

export default class NewGame extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: ""
		};
	}
	receiveName(e) {
		let name = e.target.value;
		if (name.length <= 12) {
			this.setState({ name });
		}
	}
	onFormSubmit(event) {
		event.preventDefault();
		this.props.changePage(Loading);
		this.props.server.newGame(this.state.name);
	}
	render() {
		var goToMainMenu = function() {
			this.props.changePage(MainMenu);
		};
		return (
			<div className="row">
				<div className="col-sm-6 offset-sm-3 col-8 offset-2">
					<form className="new-menu" onSubmit={this.onFormSubmit.bind(this)}>
						<p>Enter your name:</p>
						<SOInput
							placeholder=""
							onChange={this.receiveName.bind(this)}
							autoFocus={true}
							value={this.state.name}
						/>
						<br />
						<SOButton onClick={goToMainMenu.bind(this)}>Back</SOButton>
						<SOButton isSubmit={true}>Start</SOButton>
						<br />
					</form>
				</div>
			</div>
		);
	}
}
