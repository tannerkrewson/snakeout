import React, { Component } from 'react';

import SOInput from './SOInput';
import SOButton from './SOButton';

import MainMenu from './MainMenu';

export default class JoinGame extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        //prevent page from refreshing when Join game buttons are pressed
        /*$(".noformrefresh").submit(function(e) {
            e.preventDefault();
        });*/
    }
    goToMainMenu() {
        this.props.changePage(MainMenu);
    }
    joinGame() {
        server.joinGame(this.state.code, this.state.name);;
    }
    onGameCode(code) {
        this.setState({code});
    }
    onName(name) {
        this.setState({name});
    }
    render() {
        return (
        <form className="join-menu noformrefresh" onSubmit={this.joinGame}>
            <p>Enter the game code:</p>
            <SOInput placeholder="" onChange={this.onGameCode}/>
            <br/><br/>
            <p>Enter your name:</p>
            <SOInput placeholder="" onChange={this.onName}/>
            <br/><br/>
            <SOButton label="Back" onClick={this.goToMainMenu.bind(this)}/>
            <SOButton isSubmit={true} label="Join" />
                    <br/>
        </form>
        );
    }
}
