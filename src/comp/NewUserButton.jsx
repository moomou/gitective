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
    let username = this.refs.username.getDOMNode().value;
    let guid = chance.guid();
    data.createUser(username + ':' + guid);
  },
  render() {
    return (
      <div style={this.style.container}>
        <div className="inputAddOn" style={this.style.container}>
          <input className="inputAddOn-field" ref="username" type="text" placeholder="Enter Username"/>
          <button className="btn btn-black inputAddOn-btn" onClick={this.createNewUser}>Create</button>
        </div>
      </div>
    );
  }
});

export default NewUserButton;
