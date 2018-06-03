import React, { Component } from "react";

export default class SOInput extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	handleChange(event) {
		this.props.onChange(event.target.value);
	}
	render() {
		return (
			<div className="input-group mb-3">
				<input
					type="text"
					className="form-control"
					onChange={this.handleChange.bind(this)}
					placeholder={this.props.placeholder}
					autoFocus={this.props.autoFocus}
				/>
			</div>
		);
	}
}
