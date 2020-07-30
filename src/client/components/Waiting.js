import React, { Component } from "react";

import PlayerList from "./PlayerList";
import RoundInfoBar from "./RoundInfoBar";

export default class Waiting extends Component {
    render() {
        var me = this.props.you;
        var round = this.props.round;

        const disconnected = round.disconnectedList.length > 0;
        return (
            <div className="waiting">
                <p>{this.props.message}</p>
                <PlayerList players={round.waitingList} />
                {disconnected && (
                    <div>
                        <p>Disconnected Players: </p>
                        <PlayerList players={round.disconnectedList} />
                        <p>
                            The game will continue when someone joins this game
                            to take their place.
                        </p>
                    </div>
                )}
                <RoundInfoBar round={round} me={me} />
            </div>
        );
    }
}
