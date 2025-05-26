import React, { Component } from "react";

import OnMissionScreen from "./OnMissionScreen";
import RoundInfoBar from "./RoundInfoBar";

export default class MissionPhase extends Component {
    render() {
        var me = this.props.you;
        var data = this.props.round;

        data.changePage = this.props.changePage;

        return (
            <div className="selection-phase">
                <OnMissionScreen {...this.props} />
                <RoundInfoBar
                    round={data}
                    me={me}
                    ROCKETCRAB_MODE={this.props.server.ROCKETCRAB_MODE}
                />
            </div>
        );
    }
}
