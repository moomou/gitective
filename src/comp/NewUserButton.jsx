import React from 'react';
import chance from 'chance';

import * as data from '../data';

const NewUserButton = React.createClass({
  style: {
    container: {
      margin: '15px 10px 20px 10px'
    }
  },
  createNewUser() {
    let regex = /\w+/g;
    let username = this.refs.username.getDOMNode().value;
    if (!regex.test(username)) {
      this.setState({
        err: true
      });
      return;
    }
    let guid = chance.guid();
    data.createUser(username + ':' + guid);
  },
  getInitialState() {
    return {
      err: false
    };
  },
  render() {
    let msg = this.state.err ? 'Only alphanumeric characters are allowed. Must not be empty.' : '';
    return (
      <div style={this.style.container}>
        <div className="inputAddOn" style={this.style.container}>
          <input className="inputAddOn-field" ref="username" type="text" placeholder="Enter Username"/>
          <button className="btn btn-black inputAddOn-btn" onClick={this.createNewUser}>Create</button>
        </div>
        <p className="txt-center txt-red">{msg}</p>
      </div>
    );
  }
});

export default NewUserButton;
