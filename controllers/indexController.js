const spotifyModels = require("../models/spotifyModel");
const kkboxModels = require("../models/kkboxModel");
const kkboxChartsModel = kkboxModels.getChartsModel();
const spotifyChartsModel = spotifyModels.getChartsModel();

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
    return res.render("index", { kkboxCharts, spotifyCharts, user: null });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

  return;
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
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllCharts, getTracks };
