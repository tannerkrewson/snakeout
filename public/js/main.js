//
// Spyout Client
//

function Connection(onStateUpdate) {
	this.socket = io();

	this.functionsToRunOnUpdateWaitingList = [];

	var self = this;
	this.socket.on('updateState', function(data) {
		onStateUpdate(data);
	});

	this.socket.on('disconnect', function () {
		//refresh the page
		location.reload();
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
	this.send('selectionVote', {
		vote
	});
}

Connection.prototype.missionVote = function(vote) {
	this.send('missionVote', {
		vote
	});
}

Connection.prototype.updateSelectedPlayers = function(selectedPlayers) {
	this.send('updateSelectedPlayers', {
		selectedPlayers
	});
}

Connection.prototype.submitSelectedPlayers = function(selectedPlayers) {
	this.send('submitSelectedPlayers', {
		selectedPlayers
	});
}

Connection.prototype.doneViewingStart = function() {
	this.send('doneViewingStart', {});
}

Connection.prototype.doneViewingResults = function() {
	this.send('doneViewingResults', {});
}

Connection.prototype.doneViewingVoteResults = function() {
	this.send('doneViewingVoteResults', {});
}

Connection.prototype.tryReplace = function(data) {
	this.send('tryReplace', data);
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


function getPlayerById(playerList, id) {
	var index = getPlayerIndexById(playerList, id);
	if (index > -1) {
		return playerList[index];
	}
	return false;
}

function getPlayerIndexById(playerList, id) {
	for (var i = 0; i < playerList.length; i++) {
		var player = playerList[i];
		if (player.id === id) {
			return i;
		}
	}
	return -1;
}


var server;

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

		server = new Connection(function (data) {
			var round = data.round;
			var me = data.you;

			//determine if the server is waiting on us
			var isWaiting = (function() {
				for (var i = 0; i < round.waitingList.length; i++) {
					if (me.id === round.waitingList[i].id) {
						return true;
					}
				}
				return false;
			})();

			data.message = '';
			switch (round.phase) {
				case 'start':
					if (isWaiting) {
						self.props.changePage(StartPage, data);
					} else {
						data.message = 'Waiting to begin the game...';
						self.props.changePage(Waiting, data);
					}
					break;
				case 'selection':
					if (me.isCaptain) {
						self.props.changePage(SelectionPhase, data);
					} else {
						//find out who's captain
						for (var i = 0; i < round.players.length; i++) {
							if (round.players[i].isCaptain) {
								data.message += round.players[i].name + ' is selecting players for ';
								break;
							}
						}
						data.message += 'mission ' + round.currentMission.number + '...';
						self.props.changePage(CaptainWaiting, data);
					}

					break;
				case 'voting':
					//determine if we have already voted
					var alreadyVoted = false;
					var votes = round.currentMission.votes;
					var me = data.you;
					for (var i = 0; i < votes.length; i++) {
						if (votes[i].playerId === me.id) {
							alreadyVoted = true;
							break;
						}
					}

					if (!alreadyVoted) {
						self.props.changePage(VotingPhase, data);
					} else {
						data.message = "Waiting for players to vote...";
						self.props.changePage(Waiting, data);
					}
					break;
				case 'voting_results':
					if (isWaiting) {
						self.props.changePage(VotingResults, data);
					} else {
						data.message = 'Waiting for everyone to finish viewing the results...';
						self.props.changePage(Waiting, data);
					}
					break;
				case 'mission':
					//figure out if we are on this mission
					var isOnMission = false;
					for (var i = 0; i < round.currentMission.playersOnMission.length; i++) {
						var thisPlayer = round.currentMission.playersOnMission[i];
						if (thisPlayer.id === me.id) {
							isOnMission = true;
							break;
						}
					}

					//if we are on the mission, figure out if we've voted already
					var hasntVotedYet;
					var missionVotes = round.currentMission.missionVotes;
					if (isOnMission) {
						hasntVotedYet = true;
						for (var i = 0; i < missionVotes.length; i++) {
							if (missionVotes[i].playerId === me.id) {
								hasntVotedYet = false;
								break;
							}
						}
					}

					if (isOnMission && hasntVotedYet) {
						self.props.changePage(MissionPhase, data);
					} else {
						data.message = 'Waiting for the mission to complete...';
						self.props.changePage(Waiting, data);
					}

					break;
				case 'mission_results':
					if (isWaiting) {
						self.props.changePage(Results, data);
					} else {
						data.message = 'Waiting for everyone to finish viewing the results...';
						self.props.changePage(Waiting, data);
					}
					break;
			}
		});
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
		server.on('replace', function(data) {
			self.props.changePage(Replace, data);
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

		// display how many more players are needed to start the game
		var playersNeededMessage = '';
		var numPlayersInLobby = this.props.players.length;
		var notReady = false;
		if (numPlayersInLobby < 5) {
			var numPlayersNeeded = 5 - numPlayersInLobby;
			var s = (numPlayersNeeded === 1 ? '' : 's');
			playersNeededMessage = numPlayersNeeded + ' more player' + s + ' needed';
			notReady = true;
		} else if (numPlayersInLobby > 10) {
			var numPlayersNeedToLeave = numPlayersInLobby - 10;
			var s1 = numPlayersNeedToLeave === 1 ? '' : 's';
			var s2 = s1 === 's' ? '' : 's';
			playersNeededMessage = (numPlayersInLobby - 10) + ' player' + s1 + ' need' + s2 + ' to leave';
			notReady = true;
		}

    return (
      <div className="lobby">
        <p>Game Code:
					<span className="game-code">{this.props.code}</span>
				</p>
				<p>Players:</p>
				<PlayerList players={this.props.players} />
				<p>{playersNeededMessage}</p>
				<div className="btn-toolbar">
					<SOButton label="Leave Game" onClick={function() {
						location.reload();
					}} />
					<SOButton label="Start Game" onClick={startGame} disabled={notReady} />
				</div>
				<br/>
      </div>
    );
  }
});

var Replace = React.createClass({
	tryReplace: function () {
		server.tryReplace({
			playerIdToReplace: this.selectedPlayers[0].id
		});
	},
	getInitialState: function() {
		return {
			ready: false
		};
	},
	selectedPlayers: [],
	updatePlayerList: function(selectedPlayers) {
		this.selectedPlayers = selectedPlayers;

		// if one player has been selected, ready is true
		this.setState({
			ready: (this.selectedPlayers.length === 1)
		});
	},
  render: function() {
		return (
      <div className="replace">
				<p>Select a player to replace:</p>
				<PlayerSelector players={this.props.disconnectedList} onChange={this.updatePlayerList.bind(this)}/>
				<SOButton
					label="Replace"
					disabled={!this.state.ready}
					onClick={this.tryReplace.bind(this)}
				/>
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

var StartPage = React.createClass({
	doneViewingStart: function() {
		server.doneViewingStart();
	},
  render: function() {
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
				<SOButton label="Begin" onClick={this.doneViewingStart} />
      </div>
    );
  }
});

var SelectionPhase = React.createClass({
  render: function() {
		var me = this.props.you;
		var data = this.props.round;

    return (
      <div className="selection-phase">
				<CaptainSelection {...this.props}/>
				<RoundInfoBar missions={data.missions} players={data.players} me={me}/>
      </div>
    );
  }
});

var VotingPhase = React.createClass({
	voteYay: function() {
		server.vote(true);
	},
	voteNay: function() {
		server.vote(false);
	},
  render: function() {
		var me = this.props.you;
		var data = this.props.round;
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

var VotingResults = React.createClass({
	doneViewingResults: function() {
		server.doneViewingVoteResults();
	},
  render: function() {
		var me = this.props.you;
		var round = this.props.round;

		var approveVotes = [];
		var rejectVotes = [];
		for (var i = 0; i < round.currentMission.votes.length; i++) {
			var ballot = round.currentMission.votes[i];
			var player = getPlayerById(round.players, ballot.playerId);
			if (ballot.vote && player) {
				approveVotes.push(player);
			} else if (!ballot.vote && player){
				rejectVotes.push(player);
			} else {
				console.log('Results error: invalid player');
			}
		}

		var votePassed = (approveVotes.length > rejectVotes.length);
		var topMessage = '';
		var bodyMessage = '';
		if (votePassed) {
			topMessage += 'Vote passed!';
			bodyMessage += 'The mission will now commence.'
		} else {
			topMessage += 'Vote failed.'
			bodyMessage += 'A new captain will now select players.';
		}

    return (
      <div className="selection-phase">
				<p className="so-h2">{topMessage}</p>
				<p className="so-h3">{bodyMessage}</p>
				<p>Approve votes:</p>
				<PlayerList players={approveVotes} />
				<p>Reject votes:</p>
				<PlayerList players={rejectVotes} />
				<SOButton
					label="Next"
					onClick={this.doneViewingResults.bind(this)}
				/>
				<RoundInfoBar missions={round.missions} players={round.players} me={me}/>
      </div>
    );
  }
});

var MissionPhase = React.createClass({
  render: function() {
		var me = this.props.you;
		var data = this.props.round;

		data.changePage = this.props.changePage;

    return (
      <div className="selection-phase">
				<OnMissionScreen {...this.props}/>
				<RoundInfoBar missions={data.missions} players={data.players} me={me}/>
      </div>
    );
  }
});

var Results = React.createClass({
	doneViewingResults: function() {
		server.doneViewingResults();
	},
  render: function() {
		var me = this.props.you;
		var data = this.props.round;
		var currentMission = data.currentMission;

		var topMessage = 'Mission ' + currentMission.number ;
		var bodyMessage = '';
		if (currentMission.status === 'loyalist') {
			topMessage += ' passed!';
		} else if (currentMission.status === 'spy') {
			topMessage += ' failed.';
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

		// count types of votes
		var passVotes = 0;
		var failVotes = 0;
		for (var i = 0; i < currentMission.missionVotes.length; i++) {
			var ballot = currentMission.missionVotes[i];
			if (ballot.vote) {
				passVotes++;
			} else {
				failVotes++;
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

		// if the game is over, reveal who was a spy
		var SpyList = <div />;
		if (passedMissionsToLoyalistWin === 0 || failedMissionsToSpyWin === 0) {
			//get this round's spies
			var spies = [];
			data.players.forEach(function (player) {
				if (player.isSpy) {
					spies.push(player);
				}
			});

			SpyList = (
				<div>
					<p className="so-h3">The spies this round were:</p>
					<PlayerList players={spies} />
				</div>
			);
		}

    return (
      <div className="selection-phase">
				<p className="so-h2">{topMessage}</p>
				<p className="so-h3">{passVotes + ' pass votes | ' + failVotes + ' fail votes'}</p>
				<p className="so-h3">{bodyMessage}</p>
				{SpyList}
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
	updatePlayerList: function(selectedPlayers) {
		// send the update list to the server
		server.updateSelectedPlayers(selectedPlayers);

		var data = this.props.round;
		var currentMission = data.currentMission;
		var numPlayersToSelect = currentMission.playersNeeded;

		//if the user has selected the required number of players
		var ready;
		if (selectedPlayers.length === numPlayersToSelect) {
			this.setState({
				ready: true
			});
		} else {
			this.setState({
				ready: false
			});
		}
	},
	submitSelectedPlayers: function() {
		server.submitSelectedPlayers(this.props.round.captainsSelectedPlayers);
	},
  render: function() {
		var data = this.props.round;
		var currentMission = data.currentMission;
		var missionNumber = currentMission.number;
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
					selectedPlayers={data.captainsSelectedPlayers}
					numPlayersToSelect={numPlayersToSelect}
					onChange={this.updatePlayerList.bind(this)}
				/>
				<SOButton
					label="Put it to a vote!"
					disabled={!this.state.ready}
					onClick={this.submitSelectedPlayers.bind(this)}
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
		var me = this.props.you;
		var data = this.props.round;
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
  render: function() {
		var me = this.props.you;
		var data = this.props.round;
    return (
      <div className="waiting">
				<p>{this.props.message}</p>
				<PlayerList players={this.props.round.waitingList} />
				<RoundInfoBar missions={data.missions} players={data.players} me={me}/>
      </div>
    );
  }
});

var CaptainWaiting = React.createClass({
  render: function() {
		var me = this.props.you;
		var data = this.props.round;
    return (
      <div className="waiting">
				<p>{this.props.message}</p>
				<PlayerCheckboxes players={data.players} selectedPlayers={data.captainsSelectedPlayers} />
				<p>Players being waited on:</p>
				<PlayerList players={data.waitingList} />
				<RoundInfoBar missions={data.missions} players={data.players} me={me}/>
      </div>
    );
  }
});


// props: players, onChange, numPlayersToSelect
var PlayerSelector = React.createClass({
	getInitialState: function () {
		return {
			selectedPlayers: []
		};
	},
	onCheck: function(player) {
		var selectedPlayers = this.state.selectedPlayers.slice();
		var numPlayersToSelect = this.props.numPlayersToSelect;

		//see if this player has been selected
		var playerIsChecked = !!getPlayerById(selectedPlayers, player.id);

		if (!playerIsChecked) {
			//if we have not already selected the number of players needed
			if (selectedPlayers.length !== numPlayersToSelect) {
				// add the to the selectedPlayers list, checking their box
				selectedPlayers.push(player);
			}
			//if we have, the check is disallowed, so we do nothing.
		} else {
			// remove the from the selectedPlayers list, unchecking their box
			var index = getPlayerIndexById(selectedPlayers, player.id);
			if (index > -1) {
				selectedPlayers.splice(index, 1);
			} else {
				console.log('PlayerSelector error: player doesnt exist');
			}
		}

		this.setState({selectedPlayers});
		this.props.onChange(selectedPlayers);
	},
  render: function() {
		var selectedPlayers;
		if (this.props.selectedPlayers) {
			selectedPlayers = this.props.selectedPlayers;
		} else {
			selectedPlayers = this.state.selectedPlayers;
		}
    return (
			<PlayerCheckboxes players={this.props.players} selectedPlayers={selectedPlayers} onCheck={this.onCheck}/>
    );
  }
})

// props:
// players, list of players
// selectedPlayers, the players from the above list that should be checked
// onCheck, function that gets passed the player that was checked
var PlayerCheckboxes = React.createClass({
  render: function() {
		//prevent error if oncheck not passed
		if (!this.props.onCheck) {
			this.props.onCheck = function() {};
		}
		var boxes = [];
		var self = this;
		this.props.players.forEach(function(player) {
			//see if this player has been selected
			var playerIsSelected = !!getPlayerById(self.props.selectedPlayers, player.id);

			var thisPlayerOnCheck = function() {
				self.props.onCheck(player);
			}

			boxes.push(<CheckableButton
				label={player.name}
				checked={playerIsSelected}
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
