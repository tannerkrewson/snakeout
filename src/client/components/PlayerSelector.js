import React, { Component } from "react";

import PlayerCheckboxes from "./PlayerCheckboxes";
import GetPlayer from "../utils/GetPlayer";

export default class PlayerSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPlayers: []
    };
  }
  onCheck(player) {
    var selectedPlayers = this.state.selectedPlayers.slice();
    var numPlayersToSelect = this.props.numPlayersToSelect;

    //see if this player has been selected
    var playerIsChecked = !!GetPlayer.byId(selectedPlayers, player.id);

    if (!playerIsChecked) {
      //if we have not already selected the number of players needed
      if (selectedPlayers.length !== numPlayersToSelect) {
        // add the to the selectedPlayers list, checking their box
        selectedPlayers.push(player);
      }
      //if we have, the check is disallowed, so we do nothing.
    } else {
      // remove the from the selectedPlayers list, unchecking their box
      var index = GetPlayer.indexById(selectedPlayers, player.id);
      if (index > -1) {
        selectedPlayers.splice(index, 1);
      } else {
        console.log("PlayerSelector error: player doesnt exist");
      }
    }

    this.setState({ selectedPlayers });
    this.props.onChange(selectedPlayers);
  }
  render() {
    var selectedPlayers;
    if (this.props.selectedPlayers) {
      selectedPlayers = this.props.selectedPlayers;
    } else {
      selectedPlayers = this.state.selectedPlayers;
    }
    return (
      <PlayerCheckboxes
        players={this.props.players}
        selectedPlayers={selectedPlayers}
        onCheck={this.onCheck.bind(this)}
      />
    );
  }
}
