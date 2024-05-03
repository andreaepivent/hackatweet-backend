var express = require("express");
var router = express.Router();
const Tweet = require("../models/tweet");
const User = require("../models/user");

// Avoir tout les tweets
router.get("/", function (req, res, next) {
  Tweet.find()
    .populate("user")
    .then((data) => {
      res.json({ result: true, data });
    });
});

// Middleware pour convertir le token en id utilisateur
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer TOKEN_HERE"

  if (token == null) return res.sendStatus(401); // Aucun token fourni

  User.findOne({ token: token }).exec((err, user) => {
    if (err) return res.sendStatus(500); // Erreur serveur
    if (!user) return res.sendStatus(403); // Aucun utilisateur trouvé avec ce token

    req.userId = user._id.toString();
    next(); // Continue vers la route post si le token est valide
  });
}

// Post One Tweet avec le token
router.post("/", authenticateToken, function (req, res, next) {
  const newTweet = new Tweet({
    content: req.body.content,
    time: new Date().toISOString(),
    like: 0,
    hashtag: req.body.hashtag ? [req.body.hashtag] : [],
    // user: req.userId,
    user: "64000008f0f6e522704fd707",
    image: null,
  });
  newTweet
    .save()
    .then((tweet) => {
      console.log(tweet._id);
      return Tweet.findById(tweet._id).populate("user");
    })
    .then((data) => {
      res.json({ result: true, data });
    });
});

// Delete One Tweet
router.delete("/:id", function (req, res, next) {
  Post.deleteOne({ _id: req.params.id }).then((data) => {
    {
      if (data.deletedCount > 0) {
        Post.find().then((data) => {
          res.json({ result: true, data });
        });
      } else {
        res.json({ result: false, error: "Aucun post a supprimer" });
      }
    }
  });
});

// like one Tweet
router.post("/like/:id", function (req, res, next) {
  Tweet.findOne({ _id: req.params.id }).then((data) => {
    console.log(data.user._id);
    {
      if (!data) {
        res.json({ result: false, error: "Aucun tweet a like" });
      } else {
        if (data.likers.includes(data.user._id)) {
          data.likers.pop(data.user._id);
          data.save().then(() => {
            res.json({
              result: true,
              message: "Tweet déjà liké",
              likers: [data.user._id],
            });
          });
        } else {
          data.likers.push(data.user._id);
          data.save().then(() => {
            res.json({
              result: true,
              message: "Tweet liké",
              likers: [data.user._id],
            });
          });
        }
      }
    }
  });
});

module.exports = router;
