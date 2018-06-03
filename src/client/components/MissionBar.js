import React, { Component } from "react";

import MissionBox from "./MissionBox";

export default class MissionBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    var boxes = [];
    this.props.missions.forEach(function(mission, i) {
      var missionStatus;
      if (mission.status) {
        missionStatus = mission.status;
      } else {
        missionStatus = mission.playersNeeded + " players";
      }
      boxes.push(
        <MissionBox
          number={mission.number}
          status={missionStatus}
          inProgress={mission.inProgress}
          key={i}
        />
      );
    });
    return (
      <div className="mission-bar">
        <table className="table">
          <tbody>
            <tr>{boxes}</tr>
          </tbody>
        </table>
      </div>
    );
  }
}
