import React, { Component } from 'react';

import MissionBar from './MissionBar';
import RoleViewer from './RoleViewer';
import GameCode from './GameCode';

export default class RoundInfoBar extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
		var me = this.props.me;
		var round = this.props.round;
		var ourRole = this.props.me.isSpy ? 'spy' : 'loyalist';
        return (
        <div className="round-info-bar">
            <br/>
            <hr/>
            <p>Missions:</p>
            <MissionBar missions={round.missions} />
            <br/>
            <RoleViewer role={ourRole} players={round.players} me={me}/>
            <br/>
            <GameCode code={round.gameCode} />
        </div>
        );
    }
}
