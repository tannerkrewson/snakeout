//
// Spyout Client
//

function Connection() {
	this.socket = io();

	this.functionsToRunOnUpdateWaitingList = [];

	var self = this;
	this.socket.on('updateWaitingList', function(data) {
		self.waitingList = data.data.waitingList;
		self.functionsToRunOnUpdateWaitingList.forEach(function(funcToRun) {
			funcToRun(self.waitingList);
		});
	});
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

Connection.prototype.missionVote = function(vote) {
	this.send('missionVote', {
		vote
	});
}

Connection.prototype.sendSelectedPlayers = function(selectedPlayers) {
	this.send('captainsSelectedPlayers', {
		selectedPlayers
	});
}

Connection.prototype.doneViewingResults = function() {
	this.send('doneViewingResults', {});
}

Connection.prototype.getWaitingList = function() {
	return this.waitingList;
}

Connection.prototype.onUpdateWaitingList = function(funcToRun) {
	this.functionsToRunOnUpdateWaitingList.push(funcToRun);
}

Connection.prototype.offUpdateWaitingList = function() {
	this.functionsToRunOnUpdateWaitingList = [];
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
  changePage: function(page, pageProps) {
    this.setState({page, pageProps});
  },
  render: function() {
    return (
			<div className="main-content text-xs-center" id="spyout">
      	<p className="so-h1">SPYOUT</p>
        <hr/>
				<br/>
        <this.state.page changePage={this.changePage} {...this.state.pageProps}/>
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

		server.on('startMissionPhase', function(data) {
			self.props.changePage(MissionPhase, data);
		});

		server.on('missionResults', function(data) {
			self.props.changePage(Results, data);
		});

    return (
      <div className="main-menu noformrefresh">
        <SOButton label="Join Game" onClick={goToJoinGame.bind(this)}/>
        <SOButton label="New Game"  onClick={goToNewGame.bind(this)}/>
				<br/><br/>
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
				<br/>
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
				<br/>
			</form>
    );
  }
});

var Lobby = React.createClass({
  render: function() {
		var gameCode = this.props.code;
		var startGame = function() {
			server.startGame(gameCode);
		}
    return (
      <div className="lobby">
        <p>Game Code:
					<span className="game-code">{this.props.code}</span>
				</p>
				<p>Players:</p>
				<PlayerList players={this.props.players} />
				<br/>
				<div className="btn-toolbar">
					<SOButton label="Leave Game" onClick={function() {
						location.reload();
					}} />
					<SOButton label="Start Game" onClick={startGame} />
				</div>
				<br/>
      </div>
    );
  }
});

var RoundInfoBar = React.createClass({
  render: function() {
		/*
			<p>Players:</p>
			<PlayerList players={this.props.players} />
		*/

		var ourRole = this.props.me.isSpy ? 'spy' : 'loyalist';

    return (
      <div className="round-info-bar">
				<br/>
				<hr/>
				<p>Missions:</p>
				<MissionBar missions={this.props.missions} />
				<br/>
				<RoleViewer role={ourRole} players={this.props.players} me={this.props.me}/>
				<br/>
      </div>
    );
  }
});

var SelectionPhase = React.createClass({
  render: function() {
		var me = this.props.you;
		var data = this.props.data;

		// find out who the captain is
		var captain;
		for (var i = 0; i < data.players.length; i++) {
			var player = data.players[i];
			if (player.isCaptain) {
				captain = player;
			}
		}

		var CaptainComponent;
		var props = {};
		if (me.isCaptain) {
			CaptainComponent = CaptainSelection;
			props.data = data;
		} else {
			CaptainComponent = Waiting;
			props.message = 'Waiting for the captain, ' + captain.name + ', to make a selection...';
		}

    return (
      <div className="selection-phase">
				<CaptainComponent {...props}/>
				<RoundInfoBar missions={data.missions} players={data.players} me={me}/>
      </div>
    );
  }
});

var VotingPhase = React.createClass({
	voteYay: function() {
		server.vote(true);
		this.props.changePage(Waiting, {
			message: 'Waiting for everyone to vote...'
		});
	},
	voteNay: function() {
		server.vote(false);
		this.props.changePage(Waiting, {
			message: 'Waiting for everyone to vote...'
		});
	},
  render: function() {
		var me = this.props.you;
		var data = this.props.data;
		var currentMission = data.currentMission;

		// data.players is all of the players in the game.
		// currentMission.potentialPlayersOnMission is only
		// the players that might be on the mission.

		var captain = function() {
			for (var i = 0; i < data.players.length; i++) {
				if (data.players[i].isCaptain) {
					return data.players[i];
				}
			}
		}();

    return (
			<div className="voting-phase">
				<p className="so-h3">
					<span>{captain.name} </span>
					has selected:
				</p>
				<PlayerList players={currentMission.potentialPlayersOnMission} />
				<p className="so-h3">
					to go on Mission
					<span> {currentMission.number}.</span>
				</p>
				<div className="btn-toolbar">
					<SOButton label="Reject" onClick={this.voteNay.bind(this)} />
					<SOButton label="Approve" onClick={this.voteYay.bind(this)} />
				</div>
				<RoundInfoBar missions={data.missions} players={data.players} me={me}/>
      </div>
    );
  }
});

var MissionPhase = React.createClass({
  render: function() {
		var me = this.props.you;
		var data = this.props.data;
		var currentMission = data.currentMission;

		//figure out if we are on this mission
		var isOnMission = false;
		for (var i = 0; i < currentMission.playersOnMission.length; i++) {
			var thisPlayer = currentMission.playersOnMission[i]
			if (thisPlayer.id === me.id) {
				isOnMission = true;
				break;
			}
		}

		var ComponentToShow;
		var ComponentToShowProps = {};
		if (isOnMission) {
			ComponentToShow = OnMissionScreen;
			ComponentToShowProps = data;
		} else {
			ComponentToShow = Waiting;
			ComponentToShowProps.message = "Waiting for the mission to finish...";
		}

    return (
      <div className="selection-phase">
				<ComponentToShow data={ComponentToShowProps}/>
				<RoundInfoBar missions={data.missions} players={data.players} me={me}/>
      </div>
    );
  }
});

var Results = React.createClass({
	doneViewingResults: function() {
		server.doneViewingResults();
		this.props.changePage(Waiting, {
			message: 'Waiting for everyone to finish viewing the results...'
		});
	},
  render: function() {
		var me = this.props.you;
		var data = this.props.data;
		var currentMission = data.currentMission;

		var topMessage = 'Mission ' + currentMission.number ;
		var bodyMessage = '';
		if (currentMission.status === 'loyalist') {
			topMessage += ' passed';
		} else if (currentMission.status === 'spy') {
			topMessage += ' failed';
		} else {
			console.log('Results error A: mission status bad type: ' + currentMission.status);
		}

		// figure out how many missions each team has to pass/fail before they win
		var passedMissionsToLoyalistWin = 3;
		var failedMissionsToSpyWin = 3;
		for (var i = 0; i < data.missions.length; i++) {
			var thisMission = data.missions[i];
			if (thisMission.status === 'loyalist') {
				passedMissionsToLoyalistWin--;
			} else if (thisMission.status === 'spy') {
				failedMissionsToSpyWin--;
			}
		}

		if (passedMissionsToLoyalistWin === 0) {
			// loyalists won
			topMessage = 'Loyalists win!';
			bodyMessage += 'Spies needed ' + failedMissionsToSpyWin + ' more failing missions to win.\n';
		} else if (failedMissionsToSpyWin === 0) {
			// spies won
			topMessage = 'Spies win!';
			bodyMessage += 'Loyalists needed ' + passedMissionsToLoyalistWin + ' more passing missions to win.\n';
		} else {
			bodyMessage += 'Loyalists need ' + passedMissionsToLoyalistWin + ' more passing missions to win.\n';
			bodyMessage += 'Spies need ' + failedMissionsToSpyWin + ' more failing missions to win.\n';
		}

    return (
      <div className="selection-phase">
				<p className="so-h2">{topMessage}</p>
				<p className="so-h3">{bodyMessage}</p>
				<SOButton
					label="Next"
					onClick={this.doneViewingResults.bind(this)}
				/>
				<RoundInfoBar missions={data.missions} players={data.players} me={me}/>
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
		server.sendSelectedPlayers(this.selectedPlayers);
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

var OnMissionScreen = React.createClass({
	voteYay: function() {
		server.missionVote(true);
	},
	voteNay: function() {
		server.missionVote(false);
	},
  render: function() {
		var data = this.props.data;
		var me = data.you;
		var currentMission = data.currentMission;

		// data.players is all of the players in the game
		// currentMission.playersOnMission is only the players on the mission

    return (
			<div className="on-mission-screen">
				<p className="so-h3">
					You are on mission
					<span> {currentMission.number} </span>
					with:
				</p>
				<PlayerList players={currentMission.playersOnMission} />
			  <p>All players must pass this mission for it to succeed.</p>
			  <p>This mission will fail even if just one player fails it.</p>
			  <p>The other players will not know how you voted.</p>
				<div className="btn-toolbar">
					<SOButton label="Fail" onClick={this.voteNay.bind(this)} />
					<SOButton label="Pass" onClick={this.voteYay.bind(this)} />
				</div>
      </div>
    );
  }
});

var Waiting = React.createClass({
	getInitialState: function() {
		var self = this;
		server.onUpdateWaitingList(this.onUpdateWaitingList.bind(this));
		return {
			waitingList: []
		};
	},
	onUpdateWaitingList: function(waitingList) {
		this.setState({
			waitingList
		});
	},
	componentWillUnmount: function() {
		server.offUpdateWaitingList();
	},
  render: function() {
    return (
      <div className="waiting">
				<p>{this.props.message}</p>
				<PlayerList players={this.state.waitingList} />
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

var RoleViewer = React.createClass({
	showPopup: function() {
		$('#role-viewer-popup').popover('show');
	},
	hidePopup: function() {
		$('#role-viewer-popup').popover('hide');
	},
	render: function() {
		var roleMessage;
		if (this.props.role === 'loyalist') {
			roleMessage = 'You are a loyalist!';
		} else if (this.props.role === 'spy') {
			roleMessage = 'You are a spy!';
			roleMessage += '\nOther spies:';
			for (var i = 0; i < this.props.players.length; i++) {
				var thisPlayer = this.props.players[i];
				// if the player is a spy and it's not us
				if (thisPlayer.isSpy && thisPlayer.id !== this.props.me.id) {
					roleMessage += '\n' + thisPlayer.name;
				}
			}
		}
		return (
			<div className="role-viewer">
				<div
					id="role-viewer-popup"
					data-container="body"
					data-toggle="popover"
					data-placement="top"
					data-content={roleMessage}
				>
				</div>
				<button
					type="button"
					className="btn btn-secondary sobutton"
					onMouseDown={this.showPopup.bind(this)}
					onMouseUp={this.hidePopup.bind(this)}
					onTouchStart={this.showPopup.bind(this)}
					onTouchEnd={this.hidePopup.bind(this)}
					onTouchCancel={this.hidePopup.bind(this)}
				>
				Tap and hold to view your role
				</button>
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
			var missionStatus;
			if (mission.status) {
				missionStatus = mission.status;
			} else {
				missionStatus = mission.playersNeeded + ' players';
			}
			boxes.push(<MissionBox
				number={mission.number}
				status={missionStatus}
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
				<div>{'#' + this.props.number}</div>
				<div>{this.props.status}</div>
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
