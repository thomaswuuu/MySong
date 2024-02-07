const followModel = require("../models/followModel");

// For profile page
const getUserProfile = async (req, res) => {
  try {
    if (req.user) {
      const user = {
        name: req.user.name,
        email: req.user.email,
        thumbnail: req.user.thumbnail,
      };
      const follows = await followModel.find({ user_id: req.user._id });
      const kkboxFollows = follows
        .filter((follow) => follow.type == "KKBOX")
        .map((follow) => {
          return {
            type: follow.type,
            track_id: follow.track_id,
            title: follow.title,
            titleLink: follow.titleLink,
            artist: follow.artist,
            artistLink: follow.artistLink,
            cover: follow.cover,
          };
        });
      const spotifyFollows = follows
        .filter((follow) => follow.type == "Spotify")
        .map((follow) => {
          return {
            type: follow.type,
            track_id: follow.track_id,
            title: follow.title,
            titleLink: follow.titleLink,
            artist: follow.artist,
            artistLink: follow.artistLink,
            cover: follow.cover,
          };
        });
      return res.render("profile", {
        user,
        kkboxFollows,
        spotifyFollows,
      });
    } else {
      // User login timeout or not exists
      return res.redirect("/auth/login");
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getFollowStatus = async (req, res) => {
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

const setFollowStatus = async (req, res) => {
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

// For RESTful API
const getUserFollows = async (req, res) => {
  try {
    const platform = req.query.platform;
    const follows = await followModel.find({ user_id: req.user._id });
    const followTracks = follows
      .filter((followTrack) => followTrack.type == platform)
      .map((followTrack) => {
        return {
          type: followTrack.type,
          track_id: followTrack.track_id,
          title: followTrack.title,
          titleLink: followTrack.titleLink,
          artist: followTrack.artist,
          artistLink: followTrack.artistLink,
          cover: followTrack.cover,
        };
      });
    return res.json({ followTracks });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const setUserFollows = async (req, res) => {
  try {
    const user_id = req.user._id;
    const track_id = req.body.track_id;
    const queryData = { user_id, track_id };
    const count = await followModel.countDocuments(queryData);
    if (count) {
      return res.status(200).json({ message: "This track does exist" });
    } else {
      const newFollow = new followModel({
        user_id: user_id,
        type: req.body.type,
        track_id: track_id,
        title: req.body.title,
        titleLink: req.body.titleLink,
        artist: req.body.artist,
        artistLink: req.body.artistLink,
        cover: req.body.cover,
      });
      await newFollow.save();
      return res.status(201).json({ message: "Add track successfully" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const updateUserFollows = async (req, res) => {
  try {
    const user_id = req.user._id;
    const track_id = req.body.track_id;
    const queryData = { user_id, track_id };
    const count = await followModel.countDocuments(queryData);
    if (count) {
      const newFollow = {
        user_id: user_id,
        type: req.body.type,
        track_id: track_id,
        title: req.body.title,
        titleLink: req.body.titleLink,
        artist: req.body.artist,
        artistLink: req.body.artistLink,
        cover: req.body.cover,
      };
      await followModel.findOneAndUpdate(queryData, newFollow);
      return res.status(201).json({ message: "Update track successfully" });
    } else {
      return res.status(200).json({ message: "This track does exist" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const deleteUserFollows = async (req, res) => {
  try {
    const user_id = req.user._id;
    const track_id = req.body.track_id;
    const queryData = { user_id, track_id };
    const count = await followModel.countDocuments(queryData);
    if (count) {
      await followModel.deleteOne(queryData);
      return res.status(201).json({ message: "Delete track successfully" });
    } else {
      return res.status(200).json({ message: "This track does not exist" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserProfile,
  getFollowStatus,
  setFollowStatus,
  getUserFollows,
  setUserFollows,
  updateUserFollows,
  deleteUserFollows,
};
