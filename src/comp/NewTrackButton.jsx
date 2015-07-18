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
  createNewTrack() {
    let dom = this.refs.trackName.getDOMNode();
    let trackName = dom.value;
    data.addTrack(this.props.username, trackName);
    dom.value = '';
  },
  render() {
    return (
      <div className="inputAddOn" style={this.style.container}>
        <input className="inputAddOn-field" ref="trackName" type="text" placeholder="Enter Task Name"/>
        <button ref="btn" className="btn btn-orange inputAddOn-btn" onClick={this.createNewTrack}>New Task</button>
      </div>
    );
  }
});

export default NewTrackButton;
