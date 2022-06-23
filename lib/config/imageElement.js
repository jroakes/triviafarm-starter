const Image = require("@11ty/eleventy-img");
const path = require("path");
const slugNormalize = require('../filters/slugNormalize')
const sharp = require('sharp');

async function processImage(
  src,
  alt = "image",
  lazy = true,
  classes = "object-cover object-top h-full w-full",
  sizes = "67vw",
  widths = [360, 600, 960, 1200]
  ) {

  let metadata = await Image(src, {
    widths: widths,
    formats: ["webp", "jpeg"],
    urlPath: "/assets/img/",
    outputDir: "dist/assets/img/",
    concurrency: 2,
    cacheOptions: {
      // if a remote image URL, this is the amount of time before it fetches a fresh copy
      duration: "1y",
      directory: ".cache",
      removeUrlQueryParams: false,
      fetchOptions: {
    		headers: {
    			"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36"
    		}
	    }
    },
    filenameFormat: function (id, src, width, format, options) {
      const extension = path.extname(src);
      const name = slugNormalize(path.basename(src, extension));

      return `${name}-${width}w.${format}`;
    }
  });

  let imageAttributes = {
      alt,
      sizes,
      loading: lazy ? "lazy" : "eager",
      decoding: "async",
      class: classes
    };

  let data = metadata.jpeg[metadata.jpeg.length - 1];
  let html = await Image.generateHTML(metadata, imageAttributes,{
    whitespaceMode: "inline",
    });

  return {imageHTML: html,
          imageURL: data.url}
}

async function imageElement(src, alt, lazy, classes){
  try{
    let data =  await processImage(src, alt, lazy, classes);
    return data.imageHTML;
  }catch (err){
    console.log(err)
    console.log("src: " + src)
    let dft = "https://trivia.farm/assets/img/no-image.svg";
    let data = await processImage(dft, alt);
    return data.imageHTML;
  }
}

async function imageURL(src){
  try{
    let data = await processImage(src);
    return data.imageURL;
  }catch(err){
    console.log(err)
    console.log("src: " + src)
    let dft = "https://trivia.farm/assets/img/no-image.svg";
    let data = await processImage(dft);
    return data.imageURL;
  }
}


module.exports = {
  imageElement,
  imageURL
};
