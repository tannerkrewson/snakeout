import React, { Component } from 'react';

export default class GameCode extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
			<p>Game Code:
				<span className="game-code">{this.props.code}</span>
			</p>
		);
    }
}
