import React, { Component } from "react";

export default class SOInput extends Component {
    render() {
        return (
            <div className="input-group mb-3">
                <input
                    type="text"
                    className="form-control"
                    onChange={this.props.onChange}
                    placeholder={this.props.placeholder}
                    autoFocus={this.props.autoFocus}
                    value={this.props.value}
                />
            </div>
        );
    }
}
