const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstname: String,
  username: String,
  password: String,
  token: String,
  picture: { type: String, default: "profiles-pictures/profile-base.jpg" },
  inscriptionDate: String,
});

const User = mongoose.model("users", userSchema);

module.exports = User;
