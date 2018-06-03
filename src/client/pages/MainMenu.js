import React, { Component } from "react";
import SOButton from "../components/SOButton";
import RRButton from "../components/RRButton";
import JoinGame from "../components/JoinGame";
import NewGame from "../components/NewGame";
import Lobby from "../components/Lobby";
import Replace from "../components/Replace";

export default class MainMenu extends Component {
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
        self.props.server.on("updatePlayerList", function(data) {
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
          <RRButton label="How to Play" isGroup={true} path="/how-to-play" />
          <RRButton label="Screenshots" isGroup={true} path="/screenshots" />
          <RRButton
            label="More Games Like Spyout"
            isGroup={true}
            path="/more-games"
          />
        </div>
        <br />
        <br />
      </div>
    );
  }
}
