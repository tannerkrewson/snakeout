import React, { Component } from "react";

import SOButton from "./SOButton";
import RoundInfoBar from "./RoundInfoBar";

export default class Drumroll extends Component {
    readyToViewResults() {
        this.props.server.readyToViewResults();
    }
    render() {
        var me = this.props.you;
        var round = this.props.round;
        return (
            <div>
                <p className="so-h3">
                    The results of mission {round.currentMission.number} are in!
                </p>
                <SOButton onClick={this.readyToViewResults.bind(this)}>
                    Next
                </SOButton>
                <RoundInfoBar
                    round={round}
                    me={me}
                    ROCKETCRAB_MODE={this.props.server.ROCKETCRAB_MODE}
                />
            </div>
        );
    }
}
