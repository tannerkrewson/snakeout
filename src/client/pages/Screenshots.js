import React, { Component } from 'react';

export default class Screenshots extends Component {
  render() {
    return (
      <div className="spyout-screenshots">
        <div align="center">
          <img src="http://i.imgur.com/QHHm5Ri.png" width={222} />
          <img src="http://i.imgur.com/xEGpyR1.png" width={222} />
          <img src="http://i.imgur.com/APJiF8d.png" width={222} />
          <img src="http://i.imgur.com/XdtBG7h.png" width={222} />
        </div>
        <br />
        <div className="text-xs-center">
          <a href="/" className="btn btn-secondary sobutton">Back to Spyout</a>
        </div>
      </div>
    );
  }
}