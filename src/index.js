import React from 'react';
import _und from 'lodash';

import * as data from './data';
import * as util from './util';
import NewTrackButton from './comp/NewTrackButton';
import NewUserButton from './comp/NewUserButton';
import Tracker from './comp/Tracker';
import Settings from './comp/Settings';
import UndoButton from './comp/UndoButton';
import {visualize, updateGrading, getMonthScrollOffset} from './viz';

const faqContainer = document.getElementById('faq');
const newTrackControl = document.getElementById('add-track');
const newUserControl = document.getElementById('add-user');
const scrollContainer = document.getElementById('scroller');
const settingsContainer = document.getElementById('settings-container');
const trackControl = document.getElementById('track');
const undoBtnContainer = document.getElementById('undo-btn-container');
const vizContainer = document.getElementById('viz');

function locationChange() {
  if (!location.hash) {
    trackControl.classList.add('hidden');
    vizContainer.classList.add('hidden');
    newTrackControl.classList.add('hidden');

    faqContainer.classList.remove('hidden');
    newUserControl.classList.remove('hidden');
  } else if (location.hash.startsWith(data.USER_PREFIX)) {
    faqContainer.classList.add('hidden');
    newUserControl.classList.add('hidden');

    vizContainer.classList.remove('hidden');
    trackControl.classList.remove('hidden');
    newTrackControl.classList.remove('hidden');

    scrollContainer.scrollLeft = getMonthScrollOffset();

    let username = location.hash.slice(data.USER_PREFIX.length);
    let tracker = React.render(<Tracker username={username}/>, trackControl);
    let undoBtn = React.render(<UndoButton username={username}/>, undoBtnContainer);
    let settings = React.render(<Settings username={username}/>, settingsContainer);

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

    data.watchUserConfig(username, (updated) => {
      settings.updateConfig(updated);
      updateGrading(updated.grading);
      visualize(entries, _und.indexBy(tracks, 'name'));
    });

    data.watchUndo(username, (revision) => {
      if (!revision) return undoBtn.updateUndo(null);
      return util.retryUntil(() => !!tracks, () => {
        undoBtn.updateUndo(_und.indexBy(tracks, 'name')[revision.trackName].color);
      });
    });
  }
}

(function init() {
  window.onhashchange = locationChange;
  locationChange();
  React.render(<NewUserButton/>, document.getElementById('add-user-container'));
})();
