import React, { Component } from 'react';

export default class MoreGames extends Component {
  render() {
    return (
      <div className="text-xs-center">
        <div className="so-h2"><b>Games like Spyout:</b></div>
        <br />
        <div><a href="http://spyfall.crabhat.com/" target="_blank">Spyfall </a>by Evan Brumley</div>
        <div><a href="http://drawphone.tannerkrewson.com/" target="_blank">Drawphone </a>by Tanner Krewson</div>
        <div><a href="http://www.secrethitler.party/" target="_blank">Secret Hilter </a>by Samuel Mak</div>
        <div><a href="https://jackboxgames.com/games/" target="_blank">The Jackbox Party Packs </a>by Jackbox Games</div>
        <br />
        <a href="/" className="btn btn-secondary sobutton">Back to Spyout</a>
      </div>
    );
  }
}