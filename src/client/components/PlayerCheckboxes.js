import React, { Component } from 'react';

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
        //prevent error if oncheck not passed
        if (!this.props.onCheck) {
            this.props.onCheck = function() {};
        }
        var boxes = [];
        var self = this;
        this.props.players.forEach(function(player) {
            //see if this player has been selected
            var playerIsSelected = !!getPlayerById(self.props.selectedPlayers, player.id);

            var thisPlayerOnCheck = function() {
                self.props.onCheck(player);
            }

            boxes.push(<CheckableButton
                label={player.name}
                checked={playerIsSelected}
                onCheck={thisPlayerOnCheck}
            />);
        });
        return (
            <div className="row">
                <div className="col-sm-6 offset-sm-3 col-xs-8 offset-xs-2">
                    <ul className="list-unstyled row">
                    {boxes}
                    </ul>
                </div>
            </div>
        );
    }
}
