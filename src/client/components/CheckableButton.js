import React, { Component } from "react";

import SOButton from "./SOButton";

export default class CheckableButton extends Component {
	render() {
		/*var icon;
		if (this.props.checked) {
			icon = "fa-check-square-o";
		} else {
			icon = "fa-square-o";
		}*/
		let label = this.props.checked ? "X  " : "   ";
		label += this.props.label;
		return (
			<SOButton onClick={this.props.onCheck} label={label} isGroup={true} />
		);
	}
}
