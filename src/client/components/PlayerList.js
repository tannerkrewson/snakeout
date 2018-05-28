import React, { Component } from 'react';

import PlayerBox from './PlayerBox';

export default class PlayerList extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
                <div className="row">
                    <div className="col-sm-6 offset-sm-3 col-xs-8 offset-xs-2">
                        <ul className="list-unstyled row">
                            {this.props.players.map((player, i) => 
                                <PlayerBox name={player.name} key={i} />
                            )}
                        </ul>
                    </div>
                </div>
        );
    }
}
