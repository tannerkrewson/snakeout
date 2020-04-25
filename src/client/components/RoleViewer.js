import React, { Component } from "react";

export default class RoleViewer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			show: false
		};
	}
	showPopup() {
		this.setState({
			show: true
		});
	}
	hidePopup() {
		this.setState({
			show: false
		});
	}
	render() {
		var roleMessage;
		if (this.props.role === "loyalist") {
			roleMessage = "You are a loyalist!";
		} else if (this.props.role === "snake") {
			roleMessage = "You are a snake!";
			roleMessage += "\nOther snakes:";
			for (var i = 0; i < this.props.players.length; i++) {
				var thisPlayer = this.props.players[i];
				// if the player is a snake and it's not us
				if (thisPlayer.isSnake && thisPlayer.id !== this.props.me.id) {
					roleMessage += "\n" + thisPlayer.name;
				}
			}
		}

		return (
			<div className="role-viewer">
				{this.state.show && (
					// https://stackoverflow.com/a/6040258
					// plus lot of tweaking to get it centered
					<div style={{ position: "relative" }}>
						<div
							className="popover"
							style={{
								position: "absolute",
								left: "50%",
								transform: "translate(-50%, -125%)",
								textAlign: "center"
							}}
						>
							<div className="popover-body">{roleMessage}</div>
						</div>
					</div>
				)}
				<button
					type="button"
					className="btn btn-secondary"
					onMouseDown={this.showPopup.bind(this)}
					onMouseUp={this.hidePopup.bind(this)}
					onTouchStart={this.showPopup.bind(this)}
					onTouchEnd={this.hidePopup.bind(this)}
					onTouchCancel={this.hidePopup.bind(this)}
					onMouseLeave={this.hidePopup.bind(this)}
				>
					Tap and hold to view your role
				</button>
			</div>
		);
	}
}
