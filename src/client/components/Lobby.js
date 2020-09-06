import React, { Component } from "react";

import GameCode from "./GameCode";
import PlayerList from "./PlayerList";
import SOButton from "./SOButton";

export default class Lobby extends Component {
    render() {
        var gameCode = this.props.code;
        var numPlayersInLobby = this.props.players.length;

        var startGame = () => {
            this.props.server.startGame(gameCode);
            gtag("event", "game_start");
            gtag("event", "number_of_players", {
                event_label: numPlayersInLobby,
            });
        };

        var requestTransferToRocketcrab = () => {
            // TODO: disable the button after it is clicked in case there is delay

            this.props.server.requestTransferToRocketcrab();
        };

        // display how many more players are needed to start the game
        var playersNeededMessage = "";
        var notReady = false;
        if (numPlayersInLobby < 5) {
            var numPlayersNeeded = 5 - numPlayersInLobby;
            var s = numPlayersNeeded === 1 ? "" : "s";
            playersNeededMessage =
                numPlayersNeeded + " more player" + s + " needed";
            notReady = true;
        } else if (numPlayersInLobby > 10) {
            var numPlayersNeedToLeave = numPlayersInLobby - 10;
            var s1 = numPlayersNeedToLeave === 1 ? "" : "s";
            var s2 = s1 === "s" ? "" : "s";
            playersNeededMessage =
                numPlayersInLobby -
                10 +
                " player" +
                s1 +
                " need" +
                s2 +
                " to leave";
            notReady = true;
        }

        return (
            <div className="lobby">
                {!this.props.server.ROCKETCRAB_MODE && (
                    <GameCode code={this.props.code} />
                )}
                <p>Players:</p>
                <PlayerList players={this.props.players} />
                <p>{playersNeededMessage}</p>
                {!this.props.server.ROCKETCRAB_MODE && (
                    <div>
                        <SOButton onClick={requestTransferToRocketcrab}>
                            Transfer to 🚀🦀
                        </SOButton>
                    </div>
                )}
                <div>
                    <SOButton
                        onClick={() => {
                            this.props.server.socket.close();
                        }}
                    >
                        Leave Game
                    </SOButton>
                    <SOButton onClick={startGame} disabled={notReady}>
                        Start Game
                    </SOButton>
                </div>
                <br />
                <div className="card text-white mb-3">
                    <div className="card-body">
                        <p className="card-text">
                            Thanks for playing Snakeout!
                        </p>
                        <p className="card-text">
                            If you're having fun, try out my other game:
                        </p>
                        <a
                            href="http://drawphone.tannerkrewson.com/"
                            className="btn btn-secondary"
                        >
                            Play Drawphone
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}
