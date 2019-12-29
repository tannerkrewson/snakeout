import React, { Component } from "react";

import { FaCheckSquare } from "react-icons/fa";
import { FaSquare } from "react-icons/fa";

import SOButton from "./SOButton";

export default class CheckableButton extends Component {
	render() {
		const CheckIcon = this.props.checked ? FaCheckSquare : FaSquare;
		return (
			<SOButton
				onClick={this.props.onCheck}
				isGroup={true}
				disabled={this.props.disabled}
			>
				<CheckIcon />
				&nbsp;
				{this.props.children}
			</SOButton>
		);
	}
}
