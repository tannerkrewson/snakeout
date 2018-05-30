import React, { Component } from 'react';

import RRButton from '../components/RRButton';

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
          <RRButton
                label="Back to Spyout"
                path="/"
            />
        </div>
      </div>
    );
  }
}