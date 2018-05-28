import React, { Component } from 'react';

import PlayerList from './PlayerList';
import RoundInfoBar from './RoundInfoBar';

export default class Waiting extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
		var me = this.props.you;
		var data = this.props.round;
        return (
        <div className="waiting">
                <p>{this.props.message}</p>
                <PlayerList players={this.props.round.waitingList} />
                <RoundInfoBar round={data} me={me}/>
        </div>
        );
    }
}
