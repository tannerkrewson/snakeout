import React, { Component } from 'react';

import SOInput from './SOInput';
import SOButton from './SOButton';

import MainMenu from './MainMenu';

export default class NewGame extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    receiveName(name) {
        this.setState({name});
    }
    onFormSubmit(event) {
        event.preventDefault();
        this.props.server.newGame(this.state.name);
    }
    render() {
        var goToMainMenu = function() {
            this.props.changePage(MainMenu);
        };
        return (
                <form className="new-menu" onSubmit={this.onFormSubmit.bind(this)}>
                    <p>Enter your name:</p>
                    <SOInput placeholder="" onChange={this.receiveName.bind(this)}/>
                    <br/><br/>
                    <SOButton label="Back" onClick={goToMainMenu.bind(this)}/>
                    <SOButton label="Start" isSubmit={true}/>
                    <br/>
                </form>
        );
    }
}
