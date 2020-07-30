import React, { Component } from "react";

export default class SOButton extends Component {
    render() {
        var groupClass = "";
        if (this.props.isGroup) {
            groupClass = "btn-sm sogroupbut";
        }
        return (
            <button
                type={this.props.isSubmit ? "submit" : "button"}
                className={"btn btn-secondary sobutton " + groupClass}
                disabled={this.props.disabled}
                onClick={this.props.onClick}
            >
                {this.props.children}
            </button>
        );
    }
}
