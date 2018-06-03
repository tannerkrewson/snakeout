import React, { Component } from "react";

export default class RoleViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  showPopup() {
    //$('#role-viewer-popup').popover('show');
  }
  hidePopup() {
    //$('#role-viewer-popup').popover('hide');
  }
  render() {
    var roleMessage;
    if (this.props.role === "loyalist") {
      roleMessage = "You are a loyalist!";
    } else if (this.props.role === "spy") {
      roleMessage = "You are a spy!";
      roleMessage += "\nOther spies:";
      for (var i = 0; i < this.props.players.length; i++) {
        var thisPlayer = this.props.players[i];
        // if the player is a spy and it's not us
        if (thisPlayer.isSpy && thisPlayer.id !== this.props.me.id) {
          roleMessage += "\n" + thisPlayer.name;
        }
      }
    }
    return (
      <div className="role-viewer">
        <div
          id="role-viewer-popup"
          data-container="body"
          data-toggle="popover"
          data-placement="top"
          data-content={roleMessage}
        />
        <button
          type="button"
          className="btn btn-secondary sobutton"
          onMouseDown={this.showPopup.bind(this)}
          onMouseUp={this.hidePopup.bind(this)}
          onTouchStart={this.showPopup.bind(this)}
          onTouchEnd={this.hidePopup.bind(this)}
          onTouchCancel={this.hidePopup.bind(this)}
        >
          Tap and hold to view your role
        </button>
      </div>
    );
  }
}
