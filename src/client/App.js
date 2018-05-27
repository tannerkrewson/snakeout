import React, { Component } from 'react';
import MainMenu from './components/MainMenu';
import Footer from './components/Footer';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getInitialState() {
    return {page: MainMenu};
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
        <MainMenu changePage={this.changePage} {...this.state.pageProps}/>
				<Footer />
			</div>
    );
  }
}
