import React, { Component } from 'react';

export default class PlayerBox extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
			<li className="col-6 player-box white-border">{this.props.name}</li>
        );
    }
}
