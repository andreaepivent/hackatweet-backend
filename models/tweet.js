const mongoose = require("mongoose");

const tweetSchema = mongoose.Schema({
  content: String,
  time: String,
  picture: String,
  likers: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  hashtag: [String],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});

const Tweet = mongoose.model("tweets", tweetSchema);

module.exports = Tweet;
