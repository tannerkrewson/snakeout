import React, { Component } from "react";
import SOButton from './SOButton';
import Connection from '../utils/Connection'

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
    
    let server = new Connection(function(data) {
      var round = data.round;
      var me = data.you;

      //determine if the server is waiting on us
      var isWaiting = (function() {
        for (var i = 0; i < round.waitingList.length; i++) {
          if (me.id === round.waitingList[i].id) {
            return true;
          }
        }
        return false;
      })();

      data.message = "";
      switch (round.phase) {
        case "start":
          if (isWaiting) {
            self.props.changePage(StartPage, data);
          } else {
            data.message = "Waiting to begin the game...";
            self.props.changePage(Waiting, data);
          }
          break;
        case "selection":
          if (me.isCaptain) {
            self.props.changePage(SelectionPhase, data);
          } else {
            //find out who's captain
            for (var i = 0; i < round.players.length; i++) {
              if (round.players[i].isCaptain) {
                data.message +=
                  round.players[i].name + " is selecting players for ";
                break;
              }
            }
            data.message += "mission " + round.currentMission.number + "...";
            self.props.changePage(CaptainWaiting, data);
          }

          break;
        case "voting":
          //determine if we have already voted
          var alreadyVoted = false;
          var votes = round.currentMission.votes;
          var me = data.you;
          for (var i = 0; i < votes.length; i++) {
            if (votes[i].playerId === me.id) {
              alreadyVoted = true;
              break;
            }
          }

          if (!alreadyVoted) {
            self.props.changePage(VotingPhase, data);
          } else {
            data.message = "Waiting for players to vote...";
            self.props.changePage(Waiting, data);
          }
          break;
        case "voting_results":
          if (isWaiting) {
            self.props.changePage(VotingResults, data);
          } else {
            data.message =
              "Waiting for everyone to finish viewing the results...";
            self.props.changePage(Waiting, data);
          }
          break;
        case "mission":
          //figure out if we are on this mission
          var isOnMission = false;
          for (
            var i = 0;
            i < round.currentMission.playersOnMission.length;
            i++
          ) {
            var thisPlayer = round.currentMission.playersOnMission[i];
            if (thisPlayer.id === me.id) {
              isOnMission = true;
              break;
            }
          }

          //if we are on the mission, figure out if we've voted already
          var hasntVotedYet;
          var missionVotes = round.currentMission.missionVotes;
          if (isOnMission) {
            hasntVotedYet = true;
            for (var i = 0; i < missionVotes.length; i++) {
              if (missionVotes[i].playerId === me.id) {
                hasntVotedYet = false;
                break;
              }
            }
          }

          if (isOnMission && hasntVotedYet) {
            self.props.changePage(MissionPhase, data);
          } else {
            data.message = "Waiting for the mission to complete...";
            self.props.changePage(Waiting, data);
          }

          break;
        case "mission_results":
          if (isWaiting) {
            self.props.changePage(Results, data);
          } else {
            data.message =
              "Waiting for everyone to finish viewing the results...";
            self.props.changePage(Waiting, data);
          }
          break;
      }
    });
    server.on("joinGame", function(data) {
      if (data.success) {
        self.props.changePage(Lobby, data.game);
        server.on("updatePlayerList", function(data) {
          self.props.changePage(Lobby, data.game);
        });
      } else {
        alert("Failed to join game!");
      }
    });
    server.on("replace", function(data) {
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

