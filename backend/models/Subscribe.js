const mongoose = require("mongoose");

const subscribeSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    default: ""
  },
  email: {
    type: String,
    required: true,
    unique: true, // prevent duplicate subscriptions
    lowercase: true,
    trim: true
  },
  dateSubscribed: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Subscribe", subscribeSchema);
