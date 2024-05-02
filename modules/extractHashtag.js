function extractHashtags(text) {
  const regex = /#(\w+)/g;
  let match;
  const hashtags = [];

  while ((match = regex.exec(text)) !== null) {
    hashtags.push(match[1]);
  }

  return hashtags;
}

module.exports = { extractHashtags };
