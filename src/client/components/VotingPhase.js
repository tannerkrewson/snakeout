import React, { Component } from 'react';

import PlayerList from './PlayerList';
import SOButton from './SOButton';
import RoundInfoBar from './RoundInfoBar';

export default class VotingPhase extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    voteYay() {
		this.props.server.vote(true);
	}
	voteNay() {
		this.props.server.vote(false);
	}
    render() {
        var me = this.props.you;
        var data = this.props.round;
        var currentMission = data.currentMission;

        // data.players is all of the players in the game.
        // currentMission.potentialPlayersOnMission is only
        // the players that might be on the mission.

        var captain = function() {
            for (var i = 0; i < data.players.length; i++) {
                if (data.players[i].isCaptain) {
                    return data.players[i];
                }
            }
        }();

        return (
            <div className="voting-phase">
                <p className="so-h3">
                    <span>{captain.name} </span>
                    has selected:
                </p>
                <PlayerList players={currentMission.potentialPlayersOnMission} />
                <p className="so-h3">
                    to go on Mission
                    <span> {currentMission.number}.</span>
                </p>
                <div>
                    <SOButton label="Reject" onClick={this.voteNay.bind(this)} />
                    <SOButton label="Approve" onClick={this.voteYay.bind(this)} />
                </div>
                <RoundInfoBar round={data} me={me}/>
            </div>
        );
    }
}
