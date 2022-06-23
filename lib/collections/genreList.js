function fromEntries (iterable) {
  return [...iterable].reduce((obj, [key, val]) => {
    obj[key] = val;

    return obj;
  }, {});
}

/* Collection output format:
{
  genreName: numberOfPostsWithGenreName,
  ...
}
*/
module.exports = (coll) => {
  const posts = require('./trivia')(coll);

  const genreListArr = posts
    .reduce((genres, post) => {
      if ('tags' in post.data) {
        genres = genres.concat(post.data.tags);
      }

      return [...new Set(genres)].filter((genre) => typeof genre === "string" && genre.length > 0);
    }, [])
    .map((genre) => ([
      genre,
      coll.getFilteredByTag(genre).length
    ]))
    .sort((a, b) => b[1] - a[1]);

  return fromEntries(genreListArr);
};
