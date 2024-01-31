const spotifyModels = require("../models/spotifyModel");
const kkboxModels = require("../models/kkboxModel");
const kkboxChartsModel = kkboxModels.getChartsModel();
const spotifyChartsModel = spotifyModels.getChartsModel();
const followModel = require("../models/followModel");

const getAllCharts = async (req, res) => {
  try {
    // Get all charts list
    const spotifyChartsList = await spotifyChartsModel
      .find()
      .sort({ chartNo: 1 })
      .exec();
    const spotifyCharts = spotifyChartsList.map((chart) => {
      return {
        id: chart.id,
        title: chart.title,
        cover: chart.cover,
      };
    });
    const kkboxChartsList = await kkboxChartsModel
      .find()
      .sort({ chartNo: 1 })
      .exec();
    const kkboxCharts = kkboxChartsList.map((chart) => {
      return {
        id: chart.id,
        title: chart.title,
        cover: chart.cover,
      };
    });
    return res.render("index", { kkboxCharts, spotifyCharts, user: req.user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getTracks = async (req, res) => {
  try {
    const platform = req.query.platform;
    const playlist_id = req.query.id;
    const TracksModel =
      platform == "KKBOX"
        ? kkboxModels.getTracksModel()
        : spotifyModels.getTracksModel();
    const tracks = await TracksModel.find({ id: playlist_id })
      .sort({ rankNo: 1 })
      .exec();
    const tracksList = tracks.map((track) => {
      return {
        track_id: track.track_id,
        rankNo: track.rankNo,
        title: track.title,
        album: track.album,
        artist: track.artist,
        titleLink: track.titleLink,
        albumLink: track.albumLink,
        artistLink: track.artistLink,
        cover: track.cover,
        release_date: track.release_date,
      };
    });

    return res.status(200).json(tracksList);
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
      if (follows.length) return res.status(200).json({ status: "1" });
      else return res.status(200).json({ status: "0" });
    } else {
      return res.status(200).json({ status: "0" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const setFollows = async (req, res) => {
  try {
    if (req.user) {
      if (req.body.status == 1) {
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
      return res.status(200).json({ result: "ok" });
    } else {
      return res.status(401).json({ result: "unauthorized" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllCharts, getTracks, getFollows, setFollows };
