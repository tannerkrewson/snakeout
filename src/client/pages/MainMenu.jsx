import React, { Component } from "react";
import SOButton from "../components/SOButton";
import RRButton from "../components/RRButton";
import JoinGame from "../components/JoinGame";
import NewGame from "../components/NewGame";
import Lobby from "../components/Lobby";
import Replace from "../components/Replace";

export default class MainMenu extends Component {
    render() {
        var goToRocketCrabJoin = function () {
            window.location.href = "https://rocketcrab.com/join";
        };
        var goToRocketCrab = function () {
            window.location.href = "https://rocketcrab.com/transfer/snakeout";
        };

        // deprecated in favor of rocketcrab only
        //var goToJoinGame = function () {
        //    this.props.changePage(JoinGame);
        //};

        //var goToNewGame = function () {
        //    this.props.changePage(NewGame);
        //};

        var self = this;

        this.props.server.on("joinGame", function (data) {
            if (data.success) {
                self.props.changePage(Lobby, data.game);
                self.props.server.on("updatePlayerList", function (data) {
                    self.props.changePage(Lobby, data.game);
                });
                gtag("event", "game_joined");
            } else {
                self.props.changePage(JoinGame);
                gtag("event", "game_join_failed");
            }
        });

        this.props.server.on("replace", function (data) {
            self.props.changePage(Replace, data);
        });

        return (
            <div className="main-menu noformrefresh">
                <p>
                    <SOButton onClick={goToRocketCrabJoin.bind(this)}>
                        Join Game
                    </SOButton>
                    <SOButton onClick={goToRocketCrab.bind(this)}>
                        New Game
                    </SOButton>
                </p>
                <div className="sogroup" role="group" aria-label="...">
                    <RRButton isGroup={true} path="/how-to-play">
                        How to Play
                    </RRButton>
                </div>
                <div
                    style={{
                        fontStyle: "italic",
                        margin: "1em 0",
                    }}
                >
                    Powered by 🚀🦀
                </div>
            </div>
        );
    }
}
