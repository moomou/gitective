const Firebase = require('firebase');
const randomColor = require('randomColor');
const moment = require('moment');

const firebaseURL = 'https://flickering-fire-2479.firebaseio.com';
const firebaseRef = new Firebase(firebaseURL);
const UserRef = firebaseRef.child('/users');
const ConnectionRef = firebaseRef.child('.info/connected');

const DEFAULT_CONFIG = {
  changeDayAtHour: 0,
  grading: {
    s: 10,
    a: 8,
    b: 7,
    c: 6
  }
};
const TOGGLE_TIME = 5000;

export const USER_PREFIX = '#user:';

let CURRENT_REVISION;
let CURRENT_CONFIG;
let REVISIONS;
let LAST_ENTRY;
let CONNECTION_STATE;

function watchCurrentRevision(username, cb) {
  return UserRef.child(`${username}/currentRevision`).on('value', (snapshot) => {
    CURRENT_REVISION = snapshot.val();
    if (typeof cb === 'function') return cb(CURRENT_REVISION);
  });
}

function watchRevisions(username, cb) {
  return UserRef.child(`${username}/revisions`).on('value', (snapshot) => {
    REVISIONS = snapshot.val();
    if (typeof cb === 'function') return cb(REVISIONS);
  });
}

function watchLastEntry(username, cb) {
  return UserRef.child(`${username}/entries`).orderByKey().limitToLast(1).on('value', (snapshot) => {
    let keys = Object.keys(snapshot.val() || {});
    LAST_ENTRY = keys[0];
    if (typeof cb === 'function') return cb(REVISIONS);
  });
}

function toggleFirebaseConnection(state) {
  setTimeout(() => {
    if (state) {
      Firebase.goOffline();
    } else {
      Firebase.goOnline();
    }
  }, TOGGLE_TIME);
}

function watchConnection() {
  ConnectionRef.on('value', (snapshot) => {
    CONNECTION_STATE = snapshot.val();
    toggleFirebaseConnection(CONNECTION_STATE);
  });
}

export function saveUserConfig(username, config) {
  return UserRef.child(`${username}/config`).set(config);
}

export function createUser(username) {
  return UserRef.child(username).set({
    config: DEFAULT_CONFIG,
    currentRevision: 0,
    entries: { },
    revisions: { },
    tracks: { }
  }, (err) => {
    if (!err) window.location.hash = USER_PREFIX + username;
  });
}

export function addTrack(username, trackName) {
  return UserRef.child(`${username}/tracks`).push({
    name: trackName,
    color: randomColor({
      hue: 'random',
      seed: Math.round(Date.now() * Math.random())
    })
  });
}

export function addEntries(username, trackName) {
  let date = moment().subtract(CURRENT_CONFIG.changeDayAtHour, 'hour').format('YYYY-MM-DD');

  return UserRef.child(`${username}/currentRevision`).transaction(value => {
    // We reset undo entries after each day.
    if (date !== LAST_ENTRY) return 1;
    return (value || 0) + 1;
  }, (err, committed, snapshot) => {
    if (err || !committed) {
      console.error('Unable to add entry', { date, trackName });
      return;
    }

    let currentRevision = snapshot.val();

    UserRef.child(`${username}/revisions/${currentRevision}`).set({
      date,
      trackName
    });

    UserRef.child(`${username}/entries/${date}/${trackName}`).transaction(value => {
      return (value || 0) + 1;
    });
  });
}

export function undoEntries(username) {
  if (!CURRENT_REVISION) return;
  let {date, trackName} = REVISIONS[CURRENT_REVISION];

  UserRef.child(`${username}/currentRevision`).transaction(value => {
    let newValue = (value || 0) - 1;
    return Math.max(newValue, 0);
  }, (err, committed) => {
    if (err || !committed) {
      console.error('Unable to add entry', { date, trackName });
      return;
    }
    UserRef.child(`${username}/entries/${date}/${trackName}`).transaction(value => {
      let newValue = (value || 0) - 1;
      return Math.max(newValue, 0);
    });
  });
}

export function watchUserTrack(username, cb) {
  return UserRef.child(`${username}/tracks`).on('value', (snapshot) => {
    return cb(snapshot.val());
  });
}

export function watchUserEntries(username, cb) {
  return UserRef.child(`${username}/entries`).on('value', (snapshot) => {
    return cb(snapshot.val());
  });
}

export function watchUndo(username, cb) {
  watchRevisions(username);
  watchCurrentRevision(username);
  watchLastEntry(username);

  setInterval(() => {
    if (!isNaN(CURRENT_REVISION) && REVISIONS && REVISIONS.length) {
      return cb(REVISIONS[CURRENT_REVISION]);
    }
    return cb();
  }, 350);
}

export function watchUserConfig(username, cb) {
  return UserRef.child(`${username}/config`).on('value', (snapshot) => {
    CURRENT_CONFIG = snapshot.val();
    return cb(CURRENT_CONFIG);
  });
}

export function throttleConnection() {
  watchConnection();
}
