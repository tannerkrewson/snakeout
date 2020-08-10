import React, { Component } from "react";

import PlayerList from "./PlayerList";
import SOButton from "./SOButton";
import RoundInfoBar from "./RoundInfoBar";

export default class Results extends Component {
    doneViewingResults() {
        this.props.server.doneViewingResults();
    }
    render() {
        var me = this.props.you;
        var data = this.props.round;
        var currentMission = data.currentMission;

        var topMessage = "Mission " + currentMission.number;
        var bodyMessage = "";
        if (currentMission.status === "loyalist") {
            topMessage += " passed!";
        } else if (currentMission.status === "snake") {
            topMessage += " failed.";
        } else {
            console.log(
                "Results error A: mission status bad type: " +
                    currentMission.status
            );
        }

        // figure out how many missions each team has to pass/fail before they win
        var passedMissionsToLoyalistWin = 3;
        var failedMissionsToSnakeWin = 3;
        for (var i = 0; i < data.missions.length; i++) {
            var thisMission = data.missions[i];
            if (thisMission.status === "loyalist") {
                passedMissionsToLoyalistWin--;
            } else if (thisMission.status === "snake") {
                failedMissionsToSnakeWin--;
            }
        }

        // count types of votes
        var passVotes = 0;
        var failVotes = 0;
        for (var i = 0; i < currentMission.missionVotes.length; i++) {
            var ballot = currentMission.missionVotes[i];
            if (ballot.vote) {
                passVotes++;
            } else {
                failVotes++;
            }
        }

        const loyalistsWin = passedMissionsToLoyalistWin === 0;
        const snakesWin = failedMissionsToSnakeWin === 0;

        if (loyalistsWin) {
            // loyalists won
            topMessage = "Loyalists win!";
            bodyMessage +=
                "Snakes needed " +
                failedMissionsToSnakeWin +
                " more failing missions to win.\n";
        } else if (snakesWin) {
            // snakes won
            topMessage = "Snakes win!";
            bodyMessage +=
                "Loyalists needed " +
                passedMissionsToLoyalistWin +
                " more passing missions to win.\n";
        } else {
            bodyMessage +=
                "Loyalists need " +
                passedMissionsToLoyalistWin +
                " more passing missions to win.\n";
            bodyMessage +=
                "Snakes need " +
                failedMissionsToSnakeWin +
                " more failing missions to win.\n";
        }

        // if the game is over, reveal who was a snake
        var SnakeList = <div />;
        if (
            passedMissionsToLoyalistWin === 0 ||
            failedMissionsToSnakeWin === 0
        ) {
            //get this round's snakes
            var snakes = [];
            data.players.forEach(function (player) {
                if (player.isSnake) {
                    snakes.push(player);
                }
            });

            SnakeList = (
                <div>
                    <p className="so-h3">The snakes this round were:</p>
                    <PlayerList players={snakes} />
                </div>
            );
        }

        if (me.isAdmin && (loyalistsWin || snakesWin)) {
            let winner = loyalistsWin ? "loyalist" : "snake";
            gtag("event", "game_result", {
                event_label: winner,
            });
        }

        if (me.isAdmin) {
            gtag("event", "mission_result", {
                event_label: currentMission.status,
            });
        }

        return (
            <div className="selection-phase">
                <p className="so-h2">{topMessage}</p>
                <p className="so-h3">
                    {passVotes + " pass votes | " + failVotes + " fail votes"}
                </p>
                <p className="so-h3">{bodyMessage}</p>
                {SnakeList}
                <SOButton onClick={this.doneViewingResults.bind(this)}>
                    Next
                </SOButton>
                <RoundInfoBar
                    round={data}
                    me={me}
                    ROCKETCRAB_MODE={this.props.server.ROCKETCRAB_MODE}
                />
            </div>
        );
    }
}
