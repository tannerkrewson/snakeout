import React, { Component } from "react";

import RRButton from "../components/RRButton";

export default class MoreGames extends Component {
    render() {
        return (
            <div className="textS-center">
                <div className="so-h2">
                    <b>Games like Snakeout:</b>
                </div>
                <br />
                <div>
                    <a
                        href="https://spyfall.tannerkrewson.com/"
                        target="_blank"
                    >
                        Spyfall{" "}
                    </a>
                    by Tanner Krewson
                </div>
                <div>
                    <a
                        href="http://drawphone.tannerkrewson.com/"
                        target="_blank"
                    >
                        Drawphone{" "}
                    </a>
                    by Tanner Krewson
                </div>
                <div>
                    <a href="http://www.secrethitler.party/" target="_blank">
                        Secret Hilter{" "}
                    </a>
                    by Samuel Mak
                </div>
                <div>
                    <a href="https://jackboxgames.com/games/" target="_blank">
                        The Jackbox Party Packs{" "}
                    </a>
                    by Jackbox Games
                </div>
                <br />
                <RRButton path="/">Back to Snakeout</RRButton>
            </div>
        );
    }
}
