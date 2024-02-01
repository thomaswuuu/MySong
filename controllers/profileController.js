const followModel = require("../models/followModel");

const getUserProfile = async (req, res) => {
  try {
    const follows = await followModel.find({ user_id: req.user._id });
    const kkboxFollows = follows.filter((follow) => follow.type == "KKBOX");
    const spotifyFollows = follows.filter((follow) => follow.type == "Spotify");
    return res.render("profile", {
      user: req.user,
      kkboxFollows,
      spotifyFollows,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getFollows = async (req, res) => {
  try {
    if (req.user) {
      const track_id = req.query.id;
      const follows = await followModel.find({
        user_id: req.user._id,
        track_id: track_id,
      });
      // status:
      // 0 - Disable to be followed because data is exisiting
      // 1 - Enable to be followed because data is not exisiting
      const status = follows.length ? 0 : 1;
      return res.status(200).json({ result: "ok", status });
    } else {
      return res.status(200).json({ result: "ok", status: "1" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const setFollows = async (req, res) => {
  try {
    if (req.user) {
      const enable = req.body.enable;
      const action = req.body.action;
      if (enable == 1) {
        const newFollow = new followModel({
          user_id: req.user._id,
          type: req.body.type,
          track_id: req.body.track_id,
          title: req.body.title,
          titleLink: req.body.titleLink,
          artist: req.body.artist,
          artistLink: req.body.artistLink,
          cover: req.body.cover,
        });
        await newFollow.save();
      } else {
        await followModel.deleteOne({
          user_id: req.user._id,
          track_id: req.body.track_id,
        });
      }
      const status = action == 2 ? 2 : enable == 1 ? 0 : 1;
      return res.status(200).json({ result: "ok", status });
    } else {
      return res.status(401).json({ result: "unauthorized" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getUserProfile, getFollows, setFollows };
