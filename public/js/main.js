var Spyout = React.createClass({
  render: function() {
    return (
			<div className="main-content text-xs-center" id="spyout">
      	<p id="title">SPYOUT</p>
        <hr/>
        <MainMenu />
				<Bottom />
			</div>
    );
  }
});

var MainMenu = React.createClass({
  render: function() {
    return (
      <div className="main-menu">
        <SOButton label="Join Game" />
        <SOButton label="New Game" />
      </div>
    );
  }
});

var SOButton = React.createClass({
  render: function() {
    return (
      <button type="button" className="btn btn-secondary sobutton">{this.props.label}</button>
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
