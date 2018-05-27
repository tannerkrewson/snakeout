import React, { Component } from 'react';

export default class SOButton extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        var groupClass = '';
        if (!this.props.isGroup) {
            groupClass = 'sobutton-nongroup';
        }
        return (
            <button
                type={this.props.isSubmit ? "submit" : "button"}
                className={"btn btn-secondary sobutton " + groupClass}
                disabled={this.props.disabled}
                onClick={this.props.onClick}
            >
            {this.props.label}
            </button>
        );
    }
}
