const Firebase = require('firebase');
const randomColor = require('randomColor');

const firebaseURL = 'https://flickering-fire-2479.firebaseio.com';
const UserRef = new Firebase(`${firebaseURL}/users`);

export const USER_PREFIX = '#user:';

export function createUser(username) {
  return UserRef.child(username).set({
    tracks: { },
    entries: { }
  }, (err) => {
    if (!err) window.location.hash = USER_PREFIX + username;
  });
}

export function addTrack(username, trackName) {
  return UserRef.child(`${username}/tracks`).push({
    name: trackName,
    color: randomColor({
      luminosity: 'light',
      hue: 'random'
    })
  });
}

export function addEntries(username, date, trackName) {
  return UserRef.child(`${username}/entries/${date}/${trackName}`).transaction(value => {
    return (value || 0) + 1;
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
