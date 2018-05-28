import React, { Component } from 'react';
import PropTypes from 'prop-types';

import MainMenu from './components/MainMenu';
import Footer from './components/Footer';

import Connection from './utils/Connection';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: MainMenu
    };
    this.server = new Connection(function(data) {
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
    this.changePage = (page, pageProps) => {
      this.setState({page, pageProps});
    }

    //join the dev game if path was /dev
    if (this.props.isDev) {
      console.log("Attempting to join dev game");
      this.server.joinGame('ffff', Math.random().toString().substring(2, 6));
    }
  }

  render() {
    return (
			<div className="main-content text-xs-center" id="spyout">
      	<p className="so-h1">SPYOUT</p>
        <hr/>
				<br/>
        <this.state.page changePage={this.changePage} server={this.server} {...this.state.pageProps}/>
				<Footer />
			</div>
    );
  }
}
