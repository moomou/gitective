import React from 'react';
import moment from 'moment';
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
  _onClick(trackName) {
    let date = moment().format('YYYY-MM-DD');
    data.addEntries(this.props.username, date, trackName);
  },
  render() {
    let buttons = this.state.tracks.map(t => {
      return <TrackButton onClick={this._onClick} key={t.name} name={t.name} color={t.color}/>;
    });

    return (
      <div>
        {buttons}
      </div>
    );
  },
  updateTracks(tracks) {
    this.setState({
      tracks: _und.values(tracks)
    });
  }
});
