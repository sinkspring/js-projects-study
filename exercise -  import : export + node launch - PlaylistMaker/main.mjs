import { library, formatDur } from "./track.mjs";
import {
  makePlaylist,
  genPlaylist,
  addTrack,
  removeTrack,
  pickRand,
  getGenres,
  getTotalDur,
  getNP,
} from "./playlist.mjs";

const format = ({ title, artist, duration }) =>
  `${title} — ${artist} (${formatDur(duration)})`;

let a = genPlaylist("test", { genres: ["Electronic", "Hip-hop"] }, 8);

function printPlaylist({ title, tracks }) {
  console.log(`\n${title}`);
  for (const [i, track] of tracks.entries()) {
    console.log(`${i + 1}. ${format(track)}`);
  }
}

printPlaylist(a);

console.log(String(getGenres(a).join(", ")));
console.log(formatDur(getTotalDur(a)));

a = pickRand(a);

console.log("Now playing: ", format(getNP(a)));

let b = makePlaylist("test2");
const tr = library.find((tr) => tr.title === "Fade to Black");

b = pickRand(b);
const c = getNP(b);
console.log("Now playing:", c ? format(c) : "nothing");

b = addTrack(b, tr);
b = addTrack(b, {
  title: "Crazy in Love",
  album: "Dangerously in Love",
  artist: "Beyoncé",
  year: 2003,
  genre: "R&B",
  duration: 236,
});
b = addTrack(b, {
  title: "Save Tonight",
  album: "Desireless",
  artist: "Eagle-Eye Cherry",
  year: 1997,
  genre: "Pop",
  duration: 236,
});

console.log(formatDur(getTotalDur(b)));

b = addTrack(b, tr);
console.log(formatDur(getTotalDur(b)));

printPlaylist(b);

b = removeTrack(b, tr);

printPlaylist(b);
