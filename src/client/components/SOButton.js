import React, { Component } from "react";

export default class SOButton extends Component {
	render() {
		var groupClass = "";
		if (!this.props.isGroup) {
			groupClass = "sobutton-nongroup";
		}
		return (
			<button
				type={this.props.isSubmit ? "submit" : "button"}
				className={"btn btn-outline-light " + groupClass}
				disabled={this.props.disabled}
				onClick={this.props.onClick}
			>
				{this.props.label}
			</button>
		);
	}
}
