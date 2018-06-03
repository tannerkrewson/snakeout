import React, { Component } from "react";

export default class CheckableButton extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		var icon;
		if (this.props.checked) {
			icon = "fa-check-square-o";
		} else {
			icon = "fa-square-o";
		}
		return (
			<li className="col-6">
				<button
					type="button"
					className="btn btn-outline-light"
					onClick={this.props.onCheck}
				>
					<i className={"fa " + icon} aria-hidden="true" />
					&nbsp;&nbsp;
					{this.props.label}
				</button>
			</li>
		);
	}
}
