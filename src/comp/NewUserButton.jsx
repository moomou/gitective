import React from 'react';
import * as data from '../data';

const NewUserButton = React.createClass({
  propTypes: {
  },
  createNewUser() {
    let username = this.refs.username.getDOMNode().value;
    data.createUser(username);
  },
  render() {
    return (
      <div>
        <input ref="username" type="text" placeholder="New User"/>
        <button onClick={this.createNewUser}>New User</button>
      </div>
    );
  }
});

export default NewUserButton;
