import React, { Component } from "react";

import FaCheckSquareO from "react-icons/lib/fa/check-square-o";
import FaSquareO from "react-icons/lib/fa/square-o";

import SOButton from "./SOButton";

export default class CheckableButton extends Component {
	render() {
		const CheckIcon = this.props.checked ? FaCheckSquareO : FaSquareO;
		return (
			<SOButton onClick={this.props.onCheck} isGroup={true}>
				<CheckIcon />
				&nbsp;
				{this.props.children}
			</SOButton>
		);
	}
}
