import React, { Component } from "react";

import PlayerSelector from "./PlayerSelector";
import SOButton from "./SOButton";

export default class Replace extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.selectedPlayers = [];
    }
    tryReplace() {
        this.props.server.tryReplace({
            playerIdToReplace: this.selectedPlayers[0].id,
        });
        gtag("event", "try_replace");
    }
    getInitialState() {
        return {
            ready: false,
        };
    }
    updatePlayerList(selectedPlayers) {
        this.selectedPlayers = selectedPlayers;

        // if one player has been selected, ready is true
        this.setState({
            ready: this.selectedPlayers.length === 1,
        });
    }
    render() {
        return (
            <div className="replace">
                <p>Select a player to replace:</p>
                <PlayerSelector
                    players={this.props.disconnectedList}
                    numPlayersToSelect={1}
                    onChange={this.updatePlayerList.bind(this)}
                />
                <SOButton
                    disabled={!this.state.ready}
                    onClick={this.tryReplace.bind(this)}
                >
                    Replace
                </SOButton>
                <br />
            </div>
        );
    }
}
