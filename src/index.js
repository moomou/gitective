import React from 'react';
import _und from 'lodash';

import * as data from './data';
import NewTrackButton from './comp/NewTrackButton';
import NewUserButton from './comp/NewUserButton';
import Tracker from './comp/Tracker';
import {visualize} from './viz';

let newUserControl = document.getElementById('add-user');
let newTrackControl = document.getElementById('add-track');
let trackControl = document.getElementById('track');

function locationChange() {
  if (!location.hash) {
    trackControl.classList.add('hidden');
    newTrackControl.classList.add('hidden');
    newUserControl.classList.remove('hidden');
  } else if (location.hash.startsWith(data.USER_PREFIX)) {
    trackControl.classList.remove('hidden');
    newTrackControl.classList.remove('hidden');
    newUserControl.classList.add('hidden');

    let username = location.hash.slice(data.USER_PREFIX.length);
    let tracker = React.render(<Tracker username={username}/>, trackControl);

    React.render(<NewTrackButton username={username}/>, newTrackControl);

    let tracks;
    let entries;

    data.watchUserTrack(username, (updated) => {
      tracks = updated;
      tracker.updateTracks(tracks);
    });

    data.watchUserEntries(username, (updated) => {
      entries = updated;
      visualize(entries, _und.indexBy(tracks, 'name'));
    });
  }
}

(function init() {
  window.onhashchange = locationChange;
  locationChange();
  React.render(<NewUserButton/>, newUserControl);
})();
