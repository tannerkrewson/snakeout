import React, { Component } from 'react';

import PlayerSelector from './PlayerSelector';
import SOButton from './SOButton';

export default class CaptainSelection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ready: false
        };
    }
    updatePlayerList(selectedPlayers) {
        // send the update list to the server
        this.props.server.updateSelectedPlayers(selectedPlayers);
    
        var data = this.props.round;
        var currentMission = data.currentMission;
        var numPlayersToSelect = currentMission.playersNeeded;
    
        //if the user has selected the required number of players
        var ready;
        if (selectedPlayers.length === numPlayersToSelect) {
            this.setState({
                ready: true
            });
        } else {
            this.setState({
                ready: false
            });
        }
    }
    submitSelectedPlayers() {
        this.props.server.submitSelectedPlayers(this.props.round.captainsSelectedPlayers);
    }
    render() {
        var data = this.props.round;
        var currentMission = data.currentMission;
        var missionNumber = currentMission.number;
        var numPlayersToSelect = currentMission.playersNeeded;
    
        return (
        <div className="captain-selector">
            <p className="so-h2">You are captain!</p>
            <p className="so-h3">
                Select
                <span> {numPlayersToSelect} </span>
                players to go on Mission
                <span> {missionNumber}</span>:
            </p>
            <PlayerSelector
                players={data.players}
                selectedPlayers={data.captainsSelectedPlayers}
                numPlayersToSelect={numPlayersToSelect}
                onChange={this.updatePlayerList.bind(this)}
            />
            <SOButton
                label="Put it to a vote!"
                disabled={!this.state.ready}
                onClick={this.submitSelectedPlayers.bind(this)}
            />
        </div>
        );
    }
}

