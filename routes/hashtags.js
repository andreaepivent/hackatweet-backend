var express = require("express");
var router = express.Router();
const Tweet = require("../models/tweet");
const { extractHashtags } = require("../modules/extractHashtag");
const { countHashtags } = require("../modules/countHashtags");


// Tout les tweet sans hashtags
router.get("/", function (req, res, next) {
  Tweet.find({ content: { $regex: /#\w+/ } })
    .populate("user")
    .then((data) => {
      if (data.length === 0) {
        return res
          .status(404)
          .json({ message: "No tweets with hashtags found" });
      }
      res.json({ result: true, hashtags: countHashtags(data) });
    });
});

// Tout les tweet via le hashtag
router.get("/:hashtag", (req, res) => {
  const decodedHashtag = decodeURIComponent(`#${req.params.hashtag}`);

  if (!decodedHashtag.trim()) {
    return res.status(400).json({ message: "Invalid hashtag provided" });
  }

  Tweet.find({ hashtag: decodedHashtag })
    .populate("user")
    .then((data) => {
      if (data.length === 0) {
        return res.status(404).json({ message: "Aucun tweet avec ce hashtag" });
      }
      res.json({ result: true, data });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
});

module.exports = router;
