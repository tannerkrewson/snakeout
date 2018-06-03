import React, { Component } from 'react';

import GetPlayer from '../utils/GetPlayer';
import CheckableButton from './CheckableButton';

// props:
// players, list of players
// selectedPlayers, the players from the above list that should be checked
// onCheck, function that gets passed the player that was checked
export default class PlayerCheckboxes extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        var boxes = [];
        var self = this;
        this.props.players.forEach(function(player, i) {
            //see if this player has been selected
            var playerIsSelected = !!GetPlayer.byId(self.props.selectedPlayers, player.id);

            var thisPlayerOnCheck = function() {
                if (self.props.onCheck) {
                    self.props.onCheck(player);
                }
			}

            boxes.push(<CheckableButton
                label={player.name}
                checked={playerIsSelected}
                onCheck={thisPlayerOnCheck}
                key={i}
            />);
        });
        return (
            <div className="row">
                <div className="col-sm-6 offset-sm-3 col-8 offset-2">
                    <ul className="list-unstyled row">
                    {boxes}
                    </ul>
                </div>
            </div>
        );
    }
}
