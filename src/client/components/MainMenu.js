import React, { Component } from "react";
import SOButton from './SOButton';
import JoinGame from './JoinGame';
import NewGame from './NewGame';

export default class MainMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    var goToJoinGame = function() {
      this.props.changePage(JoinGame);
    };
    var goToNewGame = function() {
      this.props.changePage(NewGame);
    };
    var goToHowToPlay = function() {
      window.location.href = "/how-to-play";
    };
    var goToMoreGames = function() {
      window.location.href = "/more-games";
    };
    var goToScreenshots = function() {
      window.location.href = "/screenshots";
    };

    var self = this;

    this.props.server.on("joinGame", function(data) {
      if (data.success) {
        self.props.changePage(Lobby, data.game);
        server.on("updatePlayerList", function(data) {
          self.props.changePage(Lobby, data.game);
        });
      } else {
        alert("Failed to join game!");
      }
    });
    
    this.props.server.on("replace", function(data) {
      self.props.changePage(Replace, data);
    });

    return (
      <div className="main-menu noformrefresh">
        <p>
          <SOButton label="Join Game" onClick={goToJoinGame.bind(this)} />
          <SOButton label="New Game" onClick={goToNewGame.bind(this)} />
        </p>
        <br />
        <div className="btn-group-vertical" role="group" aria-label="...">
          <SOButton
            label="How to Play"
            isGroup={true}
            onClick={goToHowToPlay.bind(this)}
          />
          <SOButton
            label="Screenshots"
            isGroup={true}
            onClick={goToScreenshots.bind(this)}
          />
          <SOButton
            label="More Games Like Spyout"
            isGroup={true}
            onClick={goToMoreGames.bind(this)}
          />
        </div>
        <br />
        <br />
      </div>
    );
  }
}

