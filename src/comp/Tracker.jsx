import React from 'react';
import _und from 'lodash';

import * as data from '../data';
import TrackButton from './TrackButton';

export default React.createClass({
  propTypes: {
    tracks: React.PropTypes.arrayOf(React.PropTypes.object),
    username: React.PropTypes.string.isRequired
  },
  getInitialState() {
    let t = _und.values(this.props.tracks || {});
    return {
      tracks: t || []
    };
  },
  _onClick(trackName, color) {
    data.addEntries(this.props.username, trackName, color);
  },
  render() {
    let buttons = this.state.tracks.map(t => {
      return <TrackButton onClick={this._onClick} key={t.name} name={t.name} color={t.color}/>;
    });

    return (
      <div className="control">
        {buttons}
      </div>
    );
  },
  updateTracks(input) {
    let tracks = _und.values(input);
    this.setState({ tracks });
  }
});
