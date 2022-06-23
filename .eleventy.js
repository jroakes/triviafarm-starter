const jsonFileConfig = require('./lib/config/json');
const {imageElement, imageURL} = require('./lib/config/imageElement');
const metagen = require('eleventy-plugin-metagen');
const swBuild = require('./lib/config/pwaServiceWorker');

module.exports = (config) => {

  config.setDataDeepMerge(true);

  jsonFileConfig(config);

	config.addFilter("paragrapatize", (content) => {
		return ["<p>", content.replace(/(\n|\r)+/g, "</p><p>"), "</p>"].join("").replace(/<p><\/p>/g, "");
	});

  //config.setNunjucksEnvironmentOptions({ autoescape: false });

  config.addPassthroughCopy('src/assets/css/*');
  config.addPassthroughCopy('src/assets/img/**/*');
  config.addPassthroughCopy({'src/posts/img/**/*': 'assets/img/' });
  config.addPassthroughCopy({'src/trivia/img/**/*': 'assets/img/' });

  config.addWatchTarget("src/assets/js/");

  config.addLayoutAlias('default', 'layouts/default.njk');
  config.addLayoutAlias('post', 'layouts/post.njk');
  config.addLayoutAlias('trivia', 'layouts/trivia.njk');

  config.addFilter('readableDate', require('./lib/filters/readableDate'));
  config.addFilter('minifyJs', require('./lib/filters/minifyJs'));
  config.addFilter('slugNormalize', require('./lib/filters/slugNormalize'));
  config.addFilter('genreTitle', require('./lib/filters/genreTitle'));

  config.addTransform('minifyHtml', require('./lib/transforms/minifyHtml'));
  config.addNunjucksAsyncShortcode("imageElement", imageElement);
  config.addNunjucksAsyncShortcode("imageURL", imageURL);
  config.addPlugin(metagen);

  config.on('eleventy.after', async () => {
    swBuild('dist').then((res) => console.log(res));
  });
    
  config.addCollection('posts', require('./lib/collections/posts'));
  config.addCollection('tagList', require('./lib/collections/tagList'));
  config.addCollection('pagedPosts', require('./lib/collections/pagedPosts'));
  config.addCollection('pagedPostsByTag', require('./lib/collections/pagedPostsByTag'));

  config.addCollection('trivia', require('./lib/collections/trivia'));
  config.addCollection('topTrivia', require('./lib/collections/topTrivia'));
  config.addCollection('genreList', require('./lib/collections/genreList'));
  config.addCollection('pagedTrivia', require('./lib/collections/pagedTrivia'));
  config.addCollection('pagedTriviaByGenre', require('./lib/collections/pagedTriviaByGenre'));

  return {
      dir: {
        input: 'src',
        output: 'dist'
      },
      // pathPrefix: "/subfolder/",
      templateFormats: ['md', 'njk', 'html', 'json'],
      dataTemplateEngine: 'njk',
      markdownTemplateEngine: 'njk'
  };

};
