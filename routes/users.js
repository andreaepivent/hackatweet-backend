var express = require("express");
var router = express.Router();
const User = require("../models/user");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");
const { checkFields } = require("../modules/checkFields");

router.get("/", function (req, res, next) {
  User.findById("64000008f0f6e522704fd706").then((data) => {
    res.json({ result: true, user: data });
  });
});

router.post("/signup", (req, res) => {
  if (!checkFields(req.body, ["username", "firstname", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  // Check if the user has not already been registered
  User.findOne({ username: req.body.username }).then((data) => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        firstname: req.body.firstname,
        username: req.body.username,
        password: hash,
        token: uid2(32),
        picture: req.body.picture || undefined,
        inscriptionDate: new Date().toISOString(),
      });

      newUser.save().then((data) => {
        res.json({ result: true, data });
      });
    } else {
      // User already exists in database
      res.json({ result: false, error: "User already exists" });
    }
  });
});

router.post("/signin", (req, res) => {
  if (!checkFields(req.body, ["username", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  User.findOne({ username: req.body.username }).then((data) => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token: data.token });
    } else {
      res.json({ result: false, error: "User not found or wrong password" });
    }
  });
});

module.exports = router;
