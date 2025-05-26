import React, { Component } from "react";

import PlayerList from "./PlayerList";
import SOButton from "./SOButton";
import RoundInfoBar from "./RoundInfoBar";
import GetPlayer from "../utils/GetPlayer";

export default class VotingResults extends Component {
    doneViewingResults() {
        this.props.server.doneViewingVoteResults();
    }
    render() {
        var me = this.props.you;
        var round = this.props.round;

        var approveVotes = [];
        var rejectVotes = [];
        for (var i = 0; i < round.currentMission.votes.length; i++) {
            var ballot = round.currentMission.votes[i];
            var player = GetPlayer.byId(round.players, ballot.playerId);
            if (ballot.vote && player) {
                approveVotes.push(player);
            } else if (!ballot.vote && player) {
                rejectVotes.push(player);
            } else {
                console.log("Results error: invalid player");
            }
        }

        var votePassed = approveVotes.length > rejectVotes.length;
        var topMessage = "";
        var bodyMessage = "";
        if (votePassed) {
            topMessage += "Vote passed!";
            bodyMessage += "The mission will now commence.";
        } else {
            topMessage += "Vote failed.";
            bodyMessage += "A new captain will now select players.";
        }

        if (me.isAdmin) {
            gtag("event", "pre_mission_vote_result", {
                event_label: votePassed,
            });
        }

        return (
            <div className="selection-phase">
                <p className="so-h2">{topMessage}</p>
                <p className="so-h3">{bodyMessage}</p>
                <p>Approve votes:</p>
                <PlayerList players={approveVotes} />
                <p>Reject votes:</p>
                <PlayerList players={rejectVotes} />
                <SOButton onClick={this.doneViewingResults.bind(this)}>
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
