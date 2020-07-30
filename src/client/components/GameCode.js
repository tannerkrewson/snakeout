import React, { Component } from "react";

export default class GameCode extends Component {
    render() {
        return (
            <p>
                Game Code:
                <span className="game-code">{this.props.code}</span>
            </p>
        );
    }
}
