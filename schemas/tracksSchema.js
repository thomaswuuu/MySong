const mongoose = require("mongoose");

const tracksSchema = new mongoose.Schema({
  id: { type: String, require: true },
  track_id: { type: String, require: true },
  rankNo: { type: Number, require: true },
  title: { type: String, require: true },
  album: { type: String, require: true },
  artist: { type: String, require: true },
  titleLink: { type: String, require: true },
  albumLink: { type: String, require: true },
  artistLink: { type: String, require: true },
  cover: { type: String, require: true },
  release_date: { type: String, require: true },
});

module.exports = tracksSchema;
