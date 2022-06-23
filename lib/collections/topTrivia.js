module.exports = (coll) => {
  const posts = require('./trivia')(coll);

  return posts.sort(function(a, b) {
                      return b.number_of_fans - a.number_of_fans;
                    });
};
