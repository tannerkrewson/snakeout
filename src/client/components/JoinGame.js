import React, { Component } from 'react';

import SOInput from './SOInput';
import SOButton from './SOButton';

import MainMenu from './MainMenu';

export default class JoinGame extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    goToMainMenu() {
        this.props.changePage(MainMenu);
    }
    joinGame() {
        this.props.server.joinGame(this.state.code, this.state.name);;
    }
    onGameCode(code) {
        this.setState({code});
    }
    onName(name) {
        this.setState({name});
    }
    onFormSubmit(event) {
        event.preventDefault();
        this.joinGame();
    }
    render() {
        return (
        <form className="join-menu" onSubmit={this.onFormSubmit.bind(this)}>
            <p>Enter the game code:</p>
            <SOInput placeholder="" onChange={this.onGameCode.bind(this)}/>
            <br/><br/>
            <p>Enter your name:</p>
            <SOInput placeholder="" onChange={this.onName.bind(this)}/>
            <br/><br/>
            <SOButton label="Back" onClick={this.goToMainMenu.bind(this)}/>
            <SOButton isSubmit={true} label="Join" />
                    <br/>
        </form>
        );
    }
}
