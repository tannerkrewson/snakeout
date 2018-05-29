import React, { Component } from 'react';

import RoleViewer from './RoleViewer';
import MissionBar from './MissionBar';
import PlayerList from './PlayerList';
import SOButton from './SOButton';

export default class StartPage extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    doneViewingStart() {
        this.props.server.doneViewingStart();
    }
    render() {
        var me = this.props.you;
        var data = this.props.round;
    
        var ourRole = me.isSpy ? 'spy' : 'loyalist';
    
        return (
        <div className="round-info-bar">
            <p className="so-h2">Welcome to SPYOUT!</p>
            <RoleViewer role={ourRole} players={data.players} me={me}/>
            <br/>
            <p>Missions:</p>
            <MissionBar missions={data.missions} />
            <br/>
            <p>Players:</p>
            <PlayerList players={data.players} />
            <br/>
            <SOButton label="Begin" onClick={this.doneViewingStart.bind(this)} />
        </div>
        );
    }
}
