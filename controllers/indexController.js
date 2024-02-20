const kkboxModels = require("../models/kkboxModel");
const spotifyModels = require("../models/spotifyModel");
const messages = require("../models/message");

// Home
const getAllCharts = async (req, res) => {
  try {
    // User information
    const user = req.user;
    // Get all charts list
    const kkboxChartsModel = kkboxModels.getChartsModel();
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
    const spotifyChartsModel = spotifyModels.getChartsModel();
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
    return res.render("index", { user, kkboxCharts, spotifyCharts });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Charts
const getCharts = async (req, res) => {
  try {
    const platform = req.query.platform;
    const models = platform == "KKBOX" ? kkboxModels : spotifyModels;
    const chartsModel = models.getChartsModel();
    const charts = await chartsModel.find().sort({ chartNo: 1 }).exec();
    const chartsList = charts.map((chart) => {
      return {
        id: chart.id,
        title: chart.title,
        cover: chart.cover,
      };
    });

    if (chartsList.length) return res.status(200).json(chartsList);
    else return res.status(400).json({ message: messages.failed("R") });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const setCharts = async (req, res) => {
  try {
    const platform = req.query.platform;
    const models = platform == "KKBOX" ? kkboxModels : spotifyModels;
    const chartsModel = models.getChartsModel();
    const count = await chartsModel.countDocuments();
    if (count) {
      return res.status(400).json({ message: messages.failed("C") });
    } else {
      // Get charts list
      const chartsList = await models.getChartsData();
      // Save charts list
      chartsModel
        .insertMany(chartsList)
        .then(() => {
          res.status(201).json({ message: messages.success("C") });
        })
        .catch((error) => {
          res.status(500).json({ message: error.message });
        });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const updateCharts = async (req, res) => {
  try {
    const platform = req.query.platform;
    const models = platform == "KKBOX" ? kkboxModels : spotifyModels;
    const chartsModel = models.getChartsModel();
    const count = await chartsModel.countDocuments();
    if (count) {
      // Update new charts data
      const chartsList = await models.getChartsData();
      chartsList.map((item) => {
        const queryData = { chartNo: item.chartNo };
        const updateData = {
          id: item.id,
          title: item.title,
          cover: item.cover,
        };
        chartsModel.findOneAndUpdate(queryData, updateData).catch((error) => {
          throw error;
        });
      });
      return res.status(201).json({ message: messages.success("U") });
    } else {
      return res.status(400).json({ message: messages.failed("U") });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const deleteCharts = async (req, res) => {
  try {
    const platform = req.query.platform;
    const models = platform == "KKBOX" ? kkboxModels : spotifyModels;
    const chartsModel = models.getChartsModel();
    const count = await chartsModel.countDocuments();
    if (count) {
      chartsModel
        .deleteMany()
        .then(() => {
          return res.status(201).json({ message: messages.success("D") });
        })
        .catch((error) => {
          return res.status(500).json({ message: error.message });
        });
    } else {
      return res.status(400).json({ message: messages.failed("D") });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
// Tracks
const getTracks = async (req, res) => {
  try {
    const platform = req.query.platform;
    const playlist_id = req.query.id;
    const models = platform == "KKBOX" ? kkboxModels : spotifyModels;
    const tracksModel = models.getTracksModel();
    const tracks = await tracksModel
      .find({ id: playlist_id })
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

    if (tracksList.length) return res.status(200).json(tracksList);
    else return res.status(400).json({ message: messages.failed("R") });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const setTracks = async (req, res) => {
  try {
    const platform = req.query.platform;
    const playlist_id = req.query.id;
    const models = platform == "KKBOX" ? kkboxModels : spotifyModels;
    const tracksModel = models.getTracksModel();
    const count = await tracksModel.countDocuments({ id: playlist_id });
    if (count) {
      return res.status(400).json({ message: messages.failed("C") });
    } else {
      // Save tracks of playlist
      const tracksList = await models.getTracksData(playlist_id);
      tracksModel
        .insertMany(tracksList)
        .then(() => {
          return res.status(201).json({ message: messages.success("C") });
        })
        .catch((error) => {
          return res.status(500).json({ message: error.message });
        });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const updateTracks = async (req, res) => {
  try {
    const platform = req.query.platform;
    const playlist_id = req.query.id;
    const models = platform == "KKBOX" ? kkboxModels : spotifyModels;
    const tracksModel = models.getTracksModel();
    const count = await tracksModel.countDocuments({ id: playlist_id });

    if (count) {
      // Update new tracks data
      const tracksList = await models.getTracksData(playlist_id);
      tracksList.map((item) => {
        const queryData = { id: item.id, rankNo: item.rankNo };
        const updateData = {
          track_id: item.track_id,
          title: item.title,
          album: item.album,
          artist: item.artist,
          titleLink: item.titleLink,
          albumLink: item.albumLink,
          artistLink: item.artistLink,
          cover: item.cover,
          release_date: item.release_date,
        };
        tracksModel.findOneAndUpdate(queryData, updateData).catch((error) => {
          throw error;
        });
      });
      return res.status(201).json({ message: messages.success("U") });
    } else {
      return res.status(400).json({ message: messages.failed("U") });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const deleteTracks = async (req, res) => {
  try {
    const platform = req.query.platform;
    const playlist_id = req.query.id;
    const models = platform == "KKBOX" ? kkboxModels : spotifyModels;
    const tracksModel = models.getTracksModel();
    const count = await tracksModel.countDocuments({ id: playlist_id });
    if (count) {
      tracksModel
        .deleteMany({ id: playlist_id })
        .then(() => {
          return res.status(201).json({ message: messages.success("D") });
        })
        .catch((error) => {
          return res.status(500).json({ message: error.message });
        });
    } else {
      return res.status(400).json({ message: messages.failed("D") });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllCharts,
  getCharts,
  setCharts,
  updateCharts,
  deleteCharts,
  getTracks,
  setTracks,
  updateTracks,
  deleteTracks,
};
