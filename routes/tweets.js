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

  User.findOne({ token: token })
    .exec()
    .then((user) => {
      if (!user) return res.sendStatus(403); // Aucun utilisateur trouvé avec ce token
      req.userId = user._id.toString();
      next(); // Continue vers la route post si le token est valide
    })
    .catch((err) => res.sendStatus(500)); // Erreur serveur
}

// Post One Tweet avec le token
router.post("/", authenticateToken, function (req, res, next) {
  const newTweet = new Tweet({
    content: req.body.content,
    time: new Date().toISOString(),
    like: 0,
    hashtag: req.body.hashtag ? req.body.hashtag : [],
    user: req.userId,
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
  Tweet.deleteOne({ _id: req.params.id }).then((data) => {
    {
      if (data.deletedCount > 0) {
        Tweet.find().then((data) => {
          res.json({ result: true, data });
        });
      } else {
        res.json({ result: false, error: "Aucun post a supprimer" });
      }
    }
  });
});

// like one Tweet
router.post("/like/:id", authenticateToken, async function (req, res) {
  const tweetId = req.params.id;
  const userId = req.userId;

  try {
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
      return res.status(404).json({ result: false, error: "Aucun tweet à liker" });
    }

    const isLiked = tweet.likers.includes(userId);
    const update = isLiked
      ? { $pull: { likers: userId } }  // If already liked, remove the user from likers
      : { $push: { likers: userId } }; // If not liked, add the user to likers

    const updatedTweet = await Tweet.findByIdAndUpdate(tweetId, update, { new: true });
    res.json({
      result: true,
      message: isLiked ? "Like retiré" : "Tweet liké",
      likers: updatedTweet.likers
    });
  } catch (err) {
    res.status(500).json({ result: false, error: "Server error" });
  }
});

module.exports = router;
