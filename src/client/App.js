import React, { Component } from 'react';
import MainMenu from './components/MainMenu';
import Footer from './components/Footer';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: MainMenu,
      server: {}
    };
  }

  changePage(page, pageProps) {
    this.setState({page, pageProps});
  }

  render() {
    return (
			<div className="main-content text-xs-center" id="spyout">
      	<p className="so-h1">SPYOUT</p>
        <hr/>
				<br/>
        <this.state.page changePage={this.changePage} server={this.state.server} {...this.state.pageProps}/>
				<Footer />
			</div>
    );
  }
}
