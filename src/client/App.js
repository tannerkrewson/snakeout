import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import MainMenu from "./pages/MainMenu";
import HowToPlay from "./pages/HowToPlay";
import MoreGames from "./pages/MoreGames";
import Screenshots from "./pages/Screenshots";

import Footer from "./components/Footer";
import StartPage from "./components/StartPage";
import Waiting from "./components/Waiting";
import SelectionPhase from "./components/SelectionPhase";
import CaptainWaiting from "./components/CaptainWaiting";
import VotingPhase from "./components/VotingPhase";
import VotingResults from "./components/VotingResults";
import MissionPhase from "./components/MissionPhase";
import Drumroll from "./components/Drumroll";
import Results from "./components/Results";

import Connection from "./utils/Connection";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: MainMenu,
        };

        this.changePage = (page, pageProps) => {
            this.setState({ page, pageProps });
        };

        var self = this;
        this.server = new Connection(function (data) {
            var round = data.round;
            var me = data.you;

            //determine if the server is waiting on us
            var isWaiting = (function () {
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
                        self.changePage(StartPage, data);
                    } else {
                        data.message = "Waiting to begin the game...";
                        self.changePage(Waiting, data);
                    }
                    break;
                case "selection":
                    if (me.isCaptain) {
                        self.changePage(SelectionPhase, data);
                    } else {
                        //find out who's captain
                        for (var i = 0; i < round.players.length; i++) {
                            if (round.players[i].isCaptain) {
                                data.message +=
                                    round.players[i].name +
                                    " is selecting players for ";
                                break;
                            }
                        }
                        data.message +=
                            "mission " + round.currentMission.number + "...";
                        self.changePage(CaptainWaiting, data);
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
                        self.changePage(VotingPhase, data);
                    } else {
                        data.message = "Waiting for players to vote...";
                        self.changePage(Waiting, data);
                    }
                    break;
                case "voting_results":
                    if (isWaiting) {
                        self.changePage(VotingResults, data);
                    } else {
                        data.message =
                            "Waiting for everyone to finish viewing the results...";
                        self.changePage(Waiting, data);
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
                        var thisPlayer =
                            round.currentMission.playersOnMission[i];
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
                        self.changePage(MissionPhase, data);
                    } else {
                        data.message = "Waiting for the mission to complete...";
                        self.changePage(Waiting, data);
                    }

                    break;
                case "drumroll":
                    if (isWaiting) {
                        self.changePage(Drumroll, data);
                    } else {
                        data.message =
                            "Waiting for everyone to be ready to view the results...";
                        self.changePage(Waiting, data);
                    }
                    break;
                case "mission_results":
                    if (isWaiting) {
                        self.changePage(Results, data);
                    } else {
                        data.message =
                            "Waiting for everyone to finish viewing the results...";
                        self.changePage(Waiting, data);
                    }
                    break;
            }
        });

        //join the dev game if path was /dev
        if (this.props.isDev) {
            console.log("Attempting to join dev game");
            this.server.joinGame(
                "ffff",
                Math.random().toString().substring(2, 6)
            );
        }
    }

    render() {
        return (
            <Router>
                <div className="main-content text-center" id="snakeout">
                    <div className="so-h1">Snakeout 🐍</div>
                    <hr />
                    <br />
                    <Route
                        exact
                        path="/"
                        render={() => (
                            <this.state.page
                                changePage={this.changePage}
                                server={this.server}
                                {...this.state.pageProps}
                            />
                        )}
                    />
                    <Route path="/how-to-play" component={HowToPlay} />
                    <Route path="/screenshots" component={Screenshots} />
                    <Route path="/more-games" component={MoreGames} />
                    <Footer />
                </div>
            </Router>
        );
    }
}
