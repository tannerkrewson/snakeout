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
      	<p id="title">SPYOUT</p>
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
    return (
      <div className="lobby">
        <p>Game Code:
					<span id="game-code">{this.props.pageData.code}</span>
				</p>
				<PlayerList players={this.props.pageData.players} />
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
			<ul className="list-group">
			{boxes}
			</ul>
    );
  }
});

var PlayerBox = React.createClass({
  render: function() {
    return (
			<li className="list-group-item">{this.props.name}</li>
    );
  }
});

var SOButton = React.createClass({
  getInitialState: function() {
    return {
			disabled: false,
			isSubmit: false
		};
  },
  render: function() {
    return (
      <button
				type={this.props.isSubmit ? "submit" : "button"}
				className="btn btn-secondary sobutton"
				disabled={this.state.disabled}
				onClick={this.props.onClick}>{this.props.label}
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
