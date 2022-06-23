const siteData = require('../../src/_data/site');

module.exports = (coll) => {
  const genreList = require('./genreList')(coll);

  const maxPostsPerPage = siteData.paginate;
  const pagedTrivia = [];

  Object.keys(genreList).forEach((genreName) => {
    const genrePosts = [...coll.getFilteredByTag(genreName)].reverse();
    const numberOfPages = Math.ceil(genrePosts.length / maxPostsPerPage);

    for (let pageNum = 1; pageNum <= numberOfPages; pageNum++) {
      const sliceFrom = (pageNum - 1) * maxPostsPerPage;
      const sliceTo = sliceFrom + maxPostsPerPage;

      pagedTrivia.push({
        genreName,
        number: pageNum,
        posts: genrePosts.slice(sliceFrom, sliceTo),
        first: pageNum === 1,
        last: pageNum === numberOfPages
      });
    }
  });

  return pagedTrivia;
};
