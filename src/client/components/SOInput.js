import React, { Component } from "react";

export default class SOInput extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleChange(event) {
    this.props.onChange(event.target.value);
  }
  render() {
    return (
      <input
        type="text"
        onChange={this.handleChange.bind(this)}
        placeholder={this.props.placeholder}
      />
    );
  }
}
