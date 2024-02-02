const mongoose = require("mongoose");

const followSchema = new mongoose.Schema({
  user_id: { type: String, require: true },
  type: { type: String, require: true },
  track_id: { type: String, require: true },
  title: { type: String, require: true },
  titleLink: { type: String, require: true },
  artist: { type: String, require: true },
  artistLink: { type: String, require: true },
  cover: { type: String, require: true },
});

module.exports = mongoose.model("follow", followSchema);
