import React, { Component } from "react";

export default class MissionBox extends Component {
    render() {
        var inProgress = "";
        if (this.props.inProgress) {
            inProgress = "in-progress";
        }
        return (
            <td className={"mission-box white-border " + inProgress}>
                <div>{"#" + this.props.number}</div>
                <div>{this.props.status}</div>
            </td>
        );
    }
}
