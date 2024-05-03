function countHashtags(tweets) {
    const hashtagCounts = {};
  
    // Collect all hashtags into a single array
    tweets.forEach(tweet => {
      tweet.hashtag.forEach(tag => {
        hashtagCounts[tag] = (hashtagCounts[tag] || 0) + 1;
      });
    });
  
    // Convert the counts object into an array of the desired format
    const result = Object.keys(hashtagCounts).map(tag => ({
      hashtag: tag,
      occurrence: hashtagCounts[tag]
    }));
  
    return result;
  }

  module.exports = { countHashtags };