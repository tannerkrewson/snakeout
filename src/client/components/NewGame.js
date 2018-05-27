import React, { Component } from 'react';

import SOInput from './SOInput';
import SOButton from './SOButton';

import MainMenu from './MainMenu';

export default class NewGame extends Component {
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
    receiveName(name) {
        this.setState({name});
    }
    render() {
        var goToMainMenu = function() {
            this.props.changePage(MainMenu);
        };
        var startGame = function(name) {
            server.newGame(this.state.name);
        };
        return (
                <form className="new-menu noformrefresh" onSubmit={startGame.bind(this)}>
                    <p>Enter your name:</p>
                    <SOInput placeholder="" onChange={this.receiveName}/>
                    <br/><br/>
            <SOButton label="Back" onClick={goToMainMenu.bind(this)}/>
            <SOButton label="Start" isSubmit={true}/>
                    <br/>
                </form>
        );
    }
}
