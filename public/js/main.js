
function Connection() {
	this.socket = io();
}

Connection.prototype.newGame = function(name) {
	this.send('newGame', {
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
  changePage: function(page) {
    this.setState({page});
  },
  render: function() {
    return (
			<div className="main-content text-xs-center" id="spyout">
      	<p id="title">SPYOUT</p>
        <hr/>
        <this.state.page changePage={this.changePage} />
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
			self.props.changePage(Lobby);
		});

    return (
      <div className="main-menu">
        <SOButton label="Join Game" onClick={goToJoinGame.bind(this)}/>
        <SOButton label="New Game"  onClick={goToNewGame.bind(this)}/>
      </div>
    );
  }
});

var JoinGame = React.createClass({
  render: function() {
    var goToMainMenu = function() {
      this.props.changePage(MainMenu);
    };
    return (
      <div className="join-menu">
        <p>Enter the game code:</p>
        <SOInput placeholder="" />
        <br/><br/>
        <p>Enter your name:</p>
        <SOInput placeholder="" />
        <br/><br/>
        <SOButton label="Back" onClick={goToMainMenu.bind(this)}/>
        <SOButton label="Join" />
      </div>
    );
  }
});

var NewGame = React.createClass({
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
      <div className="new-menu">
        <p>Enter your name:</p>
        <SOInput placeholder="" onChange={this.receiveName}/>
        <br/><br/>
        <SOButton label="Back" onClick={goToMainMenu.bind(this)}/>
        <SOButton label="Start" onClick={startGame.bind(this)}/>
      </div>
    );
  }
});

var Lobby = React.createClass({
  render: function() {
    return (
      <div className="lobby">
        <p>This is the lobby!</p>
      </div>
    );
  }
});

var SOButton = React.createClass({
  getInitialState: function() {
    return {disabled: false};
  },
  render: function() {
    return (
      <button type="button" className="btn btn-secondary sobutton" disabled={this.state.disabled} onClick={this.props.onClick}>{this.props.label}</button>
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
