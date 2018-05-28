import React, { Component } from 'react';

export default class SelectionPhase extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
		var me = this.props.you;
		var data = this.props.round;

        return (
        <div className="selection-phase">
            <CaptainSelection {...this.props}/>
            <RoundInfoBar round={data} me={me}/>
        </div>
        );
    }
}
