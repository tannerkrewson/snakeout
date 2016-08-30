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
  render: function() {
    var goToMainMenu = function() {
      this.props.changePage(MainMenu);
    };
    return (
      <div className="new-menu">
        <p>Enter your name:</p>
        <SOInput placeholder="" />
        <br/><br/>
        <SOButton label="Back" onClick={goToMainMenu.bind(this)}/>
        <SOButton label="Start" />
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
  render: function() {
    return (
      <input type="text" placeholder={this.props.placeholder} />
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
