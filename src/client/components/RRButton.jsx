import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import SOButton from "../components/SOButton";

class RRButton extends Component {
    render() {
        return (
            <SOButton
                type={this.props.isSubmit}
                isGroup={this.props.isGroup}
                disabled={this.props.disabled}
                onClick={() => this.props.history.push(this.props.path)}
            >
                {this.props.children}
            </SOButton>
        );
    }
}

export default withRouter(RRButton);
