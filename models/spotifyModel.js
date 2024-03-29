const mongoose = require("mongoose");
const axios = require("axios");
const SpotifyWebApi = require("spotify-web-api-node");

const oauth2Schema = require("../schemas/oauth2Schema");
const chartsSchema = require("../schemas/chartsSchema");
const tracksSchema = require("../schemas/tracksSchema");

const oauth2Model = mongoose.model("spotifyOauth2", oauth2Schema);
const chartsModel = mongoose.model("spotifyCharts", chartsSchema);
const tracksModel = mongoose.model("spotifyTracks", tracksSchema);

const getChartsModel = () => {
  return chartsModel;
};
const getTracksModel = () => {
  return tracksModel;
};

/* Create token data */
const createToken = async () => {
  try {
    // Get spotify access token
    const endpoint = "https://accounts.spotify.com/api/token";
    const formatData = {
      grant_type: "client_credentials",
      client_id: process.env.SPOTIFY_CLIENT_ID,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET,
    };
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };
    const { data } = await axios.post(endpoint, formatData, { headers });
    const token = {
      access_token: data.access_token,
      token_type: data.token_type,
      expires_in: data.expires_in,
      last_timestamp: Math.floor(new Date().getTime() / 1000),
    };
    // Save spotify access token
    const length = await oauth2Model.countDocuments();
    if (length) await oauth2Model.deleteMany();
    const new_oauth2 = new oauth2Model(token);

    return await new_oauth2.save();
  } catch (error) {
    throw error;
  }
};

/* Get token data */
const getToken = async () => {
  try {
    const oauth2Data = await oauth2Model.findOne();
    if (oauth2Data) {
      // Data has already existed
      const expires_in = Boolean(oauth2Data.expires_in)
        ? oauth2Data.expires_in
        : 0;
      const last_timestamp = Boolean(oauth2Data.last_timestamp)
        ? oauth2Data.last_timestamp
        : 0;
      // Elapsed time = current timestamp - last timestamp
      const current_timestamp = Math.floor(new Date().getTime() / 1000);
      const elapsedTime = current_timestamp - last_timestamp;
      const new_expire_in = expires_in - elapsedTime;
      if (new_expire_in <= 0) return await createToken();
      const updateData = {
        expires_in: new_expire_in,
        last_timestamp: current_timestamp,
      };
      return await oauth2Model.findOneAndUpdate({}, updateData);
    } else {
      // Data does not exist
      return await createToken();
    }
  } catch (error) {
    throw error;
  }
};

/* Get filtered charts data */
const getFilteredChartsData = async (spotifyApi, keyword, limit) => {
  let response = await spotifyApi.searchPlaylists(keyword, {
    limit: limit,
    offset: 0,
    locale: "zh-TW",
  });
  let chartsData = response.body.playlists.items;

  return chartsData
    .filter(
      (item) =>
        !item.name.includes("20") && item.owner.display_name == "Spotify"
    )
    .map((item) => {
      let images = item.images;
      let cover = Boolean(images[0]) ? images[0].url : "";
      return {
        id: item.id,
        title: item.name,
        cover: cover,
      };
    });
};

/* Get charts data */
const getChartsData = async () => {
  try {
    // Get charts list
    const oauth2Data = await getToken();
    const access_token = oauth2Data.access_token;
    const spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(access_token);

    const searchKeywords = [
      "最Hit",
      "熱播50強 - 臺灣",
      "熱播50強 - 全球",
      "前 50 名 - 臺灣",
      "前 50 名 - 全球",
      "Today's Top Hits",
      "Hot Hits Taiwan",
      "Tokyo Super Hits",
    ];
    let chartsList = [];
    for (let i = 0; i < searchKeywords.length; i++) {
      let limit = 1;
      let data;
      if (i == 0) limit = 4; // Only for "最Hit" playlist
      data = await getFilteredChartsData(spotifyApi, searchKeywords[i], limit);
      chartsList = [...chartsList, ...data];
    }
    return chartsList;
  } catch (error) {
    throw error;
  }
};

/* Get tracks data */
const getTracksData = async (playlist_id) => {
  // Get tracks of specific charts playlist
  try {
    const oauth2Data = await getToken();
    const access_token = oauth2Data.access_token;
    const spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(access_token);

    const response = await spotifyApi.getPlaylist(playlist_id);
    const tracksList = [];
    const tracksData = response.body.tracks.items;
    let bias = 0; // For the condition of null track

    tracksData.forEach((item, index) => {
      if (item.track && index - bias < 50) {
        let images = item.track.album.images;
        let cover = Boolean(images[1]) ? images[1].url : "";
        let trackInfo = {
          id: playlist_id,
          track_id: item.track.id,
          rankNo: index + 1 - bias,
          title: item.track.name,
          album: item.track.album.name,
          artist: item.track.album.artists[0].name,
          titleLink: item.track.external_urls.spotify,
          albumLink: item.track.album.external_urls.spotify,
          artistLink: item.track.album.artists[0].external_urls.spotify,
          cover: cover,
          release_date: item.track.album.release_date,
        };
        tracksList.push(trackInfo);
      } else {
        bias++;
      }
    });

    return tracksList;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getChartsModel,
  getTracksModel,
  getChartsData,
  getTracksData,
};
