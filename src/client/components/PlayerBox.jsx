import React, { Component } from "react";

export default class PlayerBox extends Component {
    render() {
        return (
            <li className="col-6 player-box white-border">{this.props.name}</li>
        );
    }
}
