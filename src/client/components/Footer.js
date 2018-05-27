import React, { Component } from 'react';

export default class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
    render() {
        return (
            <footer>
                <hr/>
                Spyout by Tanner Krewson
                <br/>
                <a href="http://www.tannerkrewson.com/" target="_blank">www.tannerkrewson.com</a>
            </footer>
        );
    }
}
