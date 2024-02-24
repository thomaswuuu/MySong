const mongoose = require("mongoose");

const oauth2Schema = new mongoose.Schema({
  access_token: { type: String, require: true },
  token_type: { type: String, require: true },
  expires_in: { type: Number, require: true },
  last_timestamp: { type: Number, require: true },
});

module.exports = oauth2Schema;
