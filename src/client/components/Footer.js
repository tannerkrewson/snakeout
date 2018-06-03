import React, { Component } from "react";

export default class Footer extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<footer>
				<hr />
				Spyout by{" "}
				<a href="http://www.tannerkrewson.com/" target="_blank">
					Tanner Krewson
				</a>
				<br />
				<a href="https://github.com/tannerkrewson/spyout" target="_blank">
					View on GitHub
				</a>
			</footer>
		);
	}
}
