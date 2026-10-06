import { library } from "./track.mjs";

function makePlaylist(title) {
  return {
    title,
    tracks: [],
    nowPlaying: null,
  };
}

function shuffle(arr) {
  const q = [...arr];
  for (let i = q.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [q[i], q[j]] = [q[j], q[i]];
  }
  return q;
}

function genPlaylist(
  title,
  { genres, artists, yearFrom, yearTo } = {},
  count = 10,
) {
  const match = library.filter(
    (track) =>
      (!genres || genres.includes(track.genre)) &&
      (!artists || artists.includes(track.artist)) &&
      (!yearFrom || yearFrom <= track.year) &&
      (!yearTo || track.year <= yearTo),
  );

  const pick = shuffle(match).slice(0, count);

  return { ...makePlaylist(title), tracks: pick };
}

function addTrack(playlist, track) {
  if (playlist.tracks.some((t) => t.title === track.title)) return playlist;

  return { ...playlist, tracks: [...playlist.tracks, track] };
}

function removeTrack(playlist, track) {
  return {
    ...playlist,
    tracks: playlist.tracks.filter((t) => t.title !== track.title),
    nowPlaying: null,
  };
}

function pickRand(playlist) {
  if (playlist.tracks.length === 0) return playlist;
  return {
    ...playlist,
    nowPlaying: Math.floor(Math.random() * playlist.tracks.length),
  };
}

function getGenres(playlist) {
  return [...new Set(playlist.tracks.map((t) => t.genre))];
}

function getTotalDur(playlist) {
  return playlist.tracks
    .map((t) => t.duration)
    .reduce((dur, duration) => dur + duration, 0);
}

function getNP(playlist) {
  if (!playlist.nowPlaying === null) return null;
  return playlist.tracks[playlist.nowPlaying];
}

export {
  makePlaylist,
  genPlaylist,
  shuffle,
  addTrack,
  removeTrack,
  pickRand,
  getGenres,
  getTotalDur,
  getNP,
};
