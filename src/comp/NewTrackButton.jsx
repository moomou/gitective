import React from 'react';
import * as data from '../data';

const NewTrackButton = React.createClass({
  style: {
    container: {
      margin: 30
    }
  },
  propTypes: {
    username: React.PropTypes.string.isRequired
  },
  getInitialState() {
    return { err: false };
  },
  createNewTrack() {
    let regex = /\w+/g;
    let dom = this.refs.trackName.getDOMNode();
    let trackName = dom.value;
    if (!regex.test(trackName)) {
      this.setState({ err: true });
      return;
    }
    this.setState({err: false});
    data.addTrack(this.props.username, trackName);
    dom.value = '';
  },
  render() {
    let msg = this.state.err ? 'Only alphanumeric characters are allowed. Must not be empty.' : '';
    return (
      <div>
        <div className="inputAddOn" style={this.style.container}>
          <input className="inputAddOn-field" ref="trackName" type="text" placeholder="Enter Task Name"/>
          <button ref="btn" className="btn btn-orange inputAddOn-btn" onClick={this.createNewTrack}>New Task</button>
        </div>
        <p className="txt-center txt-red">{msg}</p>
      </div>
    );
  }
});

export default NewTrackButton;
