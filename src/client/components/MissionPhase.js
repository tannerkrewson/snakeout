import React, { Component } from "react";

import OnMissionScreen from "./OnMissionScreen";
import RoundInfoBar from "./RoundInfoBar";

export default class MissionPhase extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		var me = this.props.you;
		var data = this.props.round;

		data.changePage = this.props.changePage;

		return (
			<div className="selection-phase">
				<OnMissionScreen {...this.props} />
				<RoundInfoBar round={data} me={me} />
			</div>
		);
	}
}
