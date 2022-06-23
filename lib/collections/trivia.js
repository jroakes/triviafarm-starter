module.exports = (coll) => {
  const posts = [...coll.getFilteredByGlob('src/trivia/*.json')];

  return posts.reverse();
};
