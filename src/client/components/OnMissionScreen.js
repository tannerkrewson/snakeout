import React, { Component } from "react";

import PlayerList from "./PlayerList";
import SOButton from "./SOButton";

export default class OnMissionScreen extends Component {
    voteYay() {
        this.props.server.missionVote(true);
    }
    voteNay() {
        this.props.server.missionVote(false);
    }
    render() {
        var me = this.props.you;
        var data = this.props.round;
        var currentMission = data.currentMission;

        // data.players is all of the players in the game
        // currentMission.playersOnMission is only the players on the mission

        let twoFailNotice =
            currentMission.number === 4 && data.players.length >= 7;

        return (
            <div className="on-mission-screen">
                <p className="so-h3">
                    You are on mission
                    <span> {currentMission.number} </span>
                    with:
                </p>
                <PlayerList players={currentMission.playersOnMission} />
                {!twoFailNotice && (
                    <p>
                        All players must pass this mission for it to succeed.
                        This mission will fail even if just one player fails it.
                    </p>
                )}
                {twoFailNotice && (
                    <p>
                        All but one player must pass this mission for it to
                        succeed. This mission will fail if two or more players
                        fail it.
                    </p>
                )}
                <p>
                    The other players will not know how you voted, but they will
                    know how many pass and fail votes were cast.
                </p>
                <div>
                    <SOButton onClick={this.voteNay.bind(this)}>Fail</SOButton>
                    <SOButton onClick={this.voteYay.bind(this)}>Pass</SOButton>
                </div>
            </div>
        );
    }
}
