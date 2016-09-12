//
// Spyout Client
//

function Connection() {
	this.socket = io();
}

Connection.prototype.newGame = function(name) {
	this.send('newGame', {
		name
	});
}

Connection.prototype.joinGame = function(code, name) {
	this.send('joinGame', {
		code,
		name
	});
}

Connection.prototype.startGame = function(code) {
	this.send('startGame', {
		code
	});
}

Connection.prototype.vote = function(vote) {
	this.send('vote', {
		vote
	});
}


Connection.prototype.send = function(event, data) {
	this.socket.emit(event, data);
}

Connection.prototype.on = function(event, next) {
	this.socket.on(event, next);
}

Connection.prototype.once = function(event, next) {
	this.socket.once(event, next);
}

var server = new Connection();

var Spyout = React.createClass({
  getInitialState: function() {
    return {page: MainMenu};
  },
  changePage: function(page, pageData) {
    this.setState({page, pageData});
  },
  render: function() {
    return (
			<div className="main-content text-xs-center" id="spyout">
      	<p className="so-h1">SPYOUT</p>
        <hr/>
        <this.state.page changePage={this.changePage} pageData={this.state.pageData}/>
				<Bottom />
			</div>
    );
  }
});

var MainMenu = React.createClass({
  render: function() {
    var goToJoinGame = function() {
      this.props.changePage(JoinGame);
    };
    var goToNewGame = function() {
      this.props.changePage(NewGame);
    };

		var self = this;
		server.on('joinGame', function(data) {
			if (data.success) {
				self.props.changePage(Lobby, data.game);
				server.on('updatePlayerList', function(data) {
					self.props.changePage(Lobby, data.game);
				});
			} else {
				alert('Failed to join game!');
			}
		});

		server.on('startSelectionPhase', function(data) {
			self.props.changePage(SelectionPhase, data);
		});

		server.on('startVotingPhase', function(data) {
			self.props.changePage(VotingPhase, data);
		});

    return (
      <div className="main-menu noformrefresh">
        <SOButton label="Join Game" onClick={goToJoinGame.bind(this)}/>
        <SOButton label="New Game"  onClick={goToNewGame.bind(this)}/>
      </div>
    );
  }
});

var JoinGame = React.createClass({
	componentDidMount: function() {
		//prevent page from refreshing when Join game buttons are pressed
		$(".noformrefresh").submit(function(e) {
		  e.preventDefault();
		});
	},
	goToMainMenu: function() {
		this.props.changePage(MainMenu);
	},
	joinGame: function() {
		server.joinGame(this.state.code, this.state.name);;
	},
	onGameCode: function(code) {
		this.setState({code});
	},
	onName: function(name) {
		this.setState({name});
	},
  render: function() {
    return (
      <form className="join-menu noformrefresh" onSubmit={this.joinGame}>
        <p>Enter the game code:</p>
        <SOInput placeholder="" onChange={this.onGameCode}/>
        <br/><br/>
        <p>Enter your name:</p>
        <SOInput placeholder="" onChange={this.onName}/>
        <br/><br/>
        <SOButton label="Back" onClick={this.goToMainMenu}/>
        <SOButton isSubmit={true} label="Join" />
      </form>
    );
  }
});

var NewGame = React.createClass({
	componentDidMount: function() {
		//prevent page from refreshing when Join game buttons are pressed
		$(".noformrefresh").submit(function(e) {
		  e.preventDefault();
		});
	},
	receiveName: function(name) {
		this.setState({name});
	},
  render: function() {
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
			</form>
    );
  }
});

var Lobby = React.createClass({
  render: function() {
		var gameCode = this.props.pageData.code;
		var startGame = function() {
			server.startGame(gameCode);
		}
    return (
      <div className="lobby">
        <p>Game Code:
					<span className="game-code">{this.props.pageData.code}</span>
				</p>
				<p>Players:</p>
				<PlayerList players={this.props.pageData.players} />
				<br/>
				<div className="btn-toolbar">
					<SOButton label="Leave Game" onClick={function() {
						location.reload();
					}} />
					<SOButton label="Start Game" onClick={startGame} />
				</div>
      </div>
    );
  }
});

var RoundInfoBar = React.createClass({
  render: function() {
    return (
      <div className="round-info-bar">
				<p>Missions:</p>
				<MissionBar missions={this.props.missions} />
				<p>Players:</p>
				<PlayerList players={this.props.players} />
      </div>
    );
  }
});

var SelectionPhase = React.createClass({
  render: function() {
		var me = this.props.pageData.you;
		var data = this.props.pageData.data;

		var CaptainComponent;
		if (me.isCaptain) {
			CaptainComponent = CaptainSelection;
		} else {
			CaptainComponent = WaitingForCaptain;
		}

    return (
      <div className="selection-phase">
				<RoundInfoBar missions={data.missions} players={data.players}/>
				<CaptainComponent data={data}/>
      </div>
    );
  }
});

var CaptainSelection = React.createClass({
	getInitialState: function() {
		return {
			ready: false
		};
	},
	selectedPlayers: [],
	updatePlayerList: function(selectedPlayers) {
		this.selectedPlayers = selectedPlayers;

		var data = this.props.data;
		var currentMission = data.currentMission;
		var numPlayersToSelect = currentMission.playersNeeded;

		//if the user has selected the required number of players
		var ready;
		if (this.selectedPlayers.length === numPlayersToSelect) {
			this.setState({
				ready: true
			});
		} else {
			this.setState({
				ready: false
			});
		}
	},
	sendSelectedPlayers: function() {
		server.send('captainsSelectedPlayers', {
			selectedPlayers: this.selectedPlayers
		});
	},
  render: function() {
		var data = this.props.data;
		var missionNumber = data.missionNumber;
		var currentMission = data.currentMission;
		var numPlayersToSelect = currentMission.playersNeeded;

    return (
      <div className="captain-selector">
				<p className="so-h2">You are captain!</p>
				<p className="so-h3">
					Select
					<span> {numPlayersToSelect} </span>
					players to go on Mission
					<span> {missionNumber}</span>:
				</p>
				<PlayerSelector
					players={data.players}
					numPlayersToSelect={numPlayersToSelect}
					onChange={this.updatePlayerList.bind(this)}
				/>
				<SOButton
					label="Put it to a vote!"
					disabled={!this.state.ready}
					onClick={this.sendSelectedPlayers.bind(this)}
				/>
      </div>
    );
  }
});

var WaitingForCaptain = React.createClass({
  render: function() {
    return (
      <div className="waiting-for-captain">
				<p>Waiting for the captain to make a selection...</p>
      </div>
    );
  }
});

var PlayerSelector = React.createClass({
	getInitialState: function() {
		return {
			selectedPlayers: []
		};
	},
	onCheck: function(player) {
		var selectedPlayers = this.state.selectedPlayers.slice();
		var numPlayersToSelect = this.props.numPlayersToSelect;

		//see if this player has been selected
		var isChecked = false;
		var index = selectedPlayers.indexOf(player);
		if (index > -1) {
			isChecked = true;
		}

		if (!isChecked) {
			//if we have not already selected the number of players needed
			if (selectedPlayers.length !== numPlayersToSelect) {
				selectedPlayers.push(player);
			}
			//if we have, the check is disallowed, so we do nothing.
		} else {
			//unchecks are always allowed
			var index = selectedPlayers.indexOf(player);
			if (index > -1) {
				selectedPlayers.splice(index, 1);
			}
		}
		this.setState({selectedPlayers});
		this.props.onChange(selectedPlayers);
	},
  render: function() {
		var boxes = [];
		var self = this;
		this.props.players.forEach(function(player) {
			//see if this player has been selected
			var selected = false;
			var index = self.state.selectedPlayers.indexOf(player);
			if (index > -1) {
				selected = true;
			}
			var thisPlayerOnCheck = function() {
				self.onCheck(player);
			}
			boxes.push(<CheckableButton
				label={player.name}
				checked={selected}
				onCheck={thisPlayerOnCheck}
			/>);
		});
    return (
			<div className="row">
				<div className="col-sm-6 offset-sm-3 col-xs-8 offset-xs-2">
					<ul className="list-unstyled row">
					{boxes}
					</ul>
				</div>
			</div>
    );
  }
})

var VotingPhase = React.createClass({
	voteYay: function() {
		server.vote(true);
	},
	voteNay: function() {
		server.vote(false);
	},
  render: function() {
		var me = this.props.pageData.you;
		var data = this.props.pageData.data;
		var currentMission = data.currentMission;

		// data.players is all of the players in the game
		// currentMission.playersOnMission is only the players on the mission

		var captain = function() {
			for (var i = 0; i < data.players.length; i++) {
				if (data.players[i].isCaptain) {
					return data.players[i];
				}
			}
		}();

    return (
			<div className="voting-phase">
				<RoundInfoBar missions={data.missions} players={data.players}/>
				<p className="so-h3">
					<span>{captain.name} </span>
					has selected:
				</p>
				<PlayerList players={currentMission.potentialPlayersOnMission} />
				<p className="so-h3">
					to go on Mission
					<span>{currentMission.number}.</span>
				</p>
				<div className="btn-toolbar">
					<SOButton label="Reject" onClick={this.voteNay.bind(this)} />
					<SOButton label="Approve" onClick={this.voteYay.bind(this)} />
				</div>
      </div>
    );
  }
});

var PlayerList = React.createClass({
  render: function() {
		var boxes = [];
		this.props.players.forEach(function(player) {
			boxes.push(<PlayerBox name={player.name} />);
		});
    return (
			<div className="row">
				<div className="col-sm-6 offset-sm-3 col-xs-8 offset-xs-2">
					<ul className="list-unstyled row">
					{boxes}
					</ul>
				</div>
			</div>
    );
  }
});

var PlayerBox = React.createClass({
  render: function() {
    return (
			<li className="col-xs-6 player-box white-border">{this.props.name}</li>
    );
  }
});

var CheckableButton = React.createClass({
  render: function() {
		var icon;
		if (this.props.checked) {
			icon = 'fa-check-square-o';
		} else {
			icon = 'fa-square-o';
		}
    return (
			<li className="col-xs-6">
				<button
					type="button"
					className="btn btn-secondary sobutton"
					onClick={this.props.onCheck}
				>
				<i className={"fa " + icon} aria-hidden="true"></i>
				&nbsp;&nbsp;
				{this.props.label}
				</button>
			</li>
    );
  }
});

var MissionBar = React.createClass({
  render: function() {
		var boxes = [];
		this.props.missions.forEach(function(mission) {
			boxes.push(<MissionBox
				number={mission.number}
				status={mission.status}
				inProgress={mission.inProgress}
			/>);
		});
    return (
			<div className="mission-bar">
				<table className="table">
				  <tbody>
				    <tr>
							{boxes}
				    </tr>
				  </tbody>
				</table>
			</div>
    );
  }
});

var MissionBox = React.createClass({
  render: function() {
		var inProgress = '';
		if (this.props.inProgress) {
			inProgress = 'in-progress';
		}
    return (
			<td className={"mission-box white-border " + inProgress}>
				<p>{this.props.number}</p>
				<p>{this.props.status}</p>
			</td>
    );
  }
});

var SOButton = React.createClass({
  render: function() {
    return (
      <button
				type={this.props.isSubmit ? "submit" : "button"}
				className="btn btn-secondary sobutton"
				disabled={this.props.disabled}
				onClick={this.props.onClick}
			>
			{this.props.label}
			</button>
    );
  }
});

var SOInput = React.createClass({
	handleChange: function(event) {
    this.props.onChange(event.target.value);
  },
  render: function() {
    return (
      <input type="text" onChange={this.handleChange.bind(this)} placeholder={this.props.placeholder} />
    );
  }
});

var Bottom = React.createClass({
	render: function() {
		return (
			<footer>
        <hr/>
				Spyout by Tanner Krewson
				<br/>
				<a href="http://www.tannerkrewson.com/" target="_blank">www.tannerkrewson.com</a>
			</footer>
		);
	}
});

ReactDOM.render(
  <Spyout />,
  document.getElementById('root')
);

//try to join the dev game
var relativeUrl = window.location.pathname + window.location.search;
if (relativeUrl === '/dev') {
	server.joinGame('ffff', Math.random().toString().substring(2, 6));
}
