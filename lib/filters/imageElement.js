const Image = require("@11ty/eleventy-img");
const path = require("path");
const slugNormalize = require('../filters/slugNormalize')
const lazyImage = "data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%201%201'%20height%3D'500'%20width%3D'960'%20style%3D'background-color%3Argb(203%2C213%2C224)'%2F%3E";


async function imageElement(src, alt) {
  if(alt === undefined) {
    // You bet we throw an error on missing alt (alt="" works okay)
    throw new Error(`Missing \`alt\` on myImage from: ${src}`);
  }

  let metadata = await Image(src, {
    widths: [960],
    formats: ["webp"],
    urlPath: "/assets/img/",
    outputDir: ".dist/assets/img/",
    filenameFormat: function (id, src, width, format, options) {
      const extension = path.extname(src);
      const name = slugNormalize(path.basename(src, extension));

      return `${name}-${width}w.${format}`;
    }
  });

  let data = metadata.webp[metadata.webp.length - 1];

  return `<img class="w-full m-0 rounded-t lazy" src="${lazyImage}" data-src="${data.url}" width="${data.width}" height="${data.height}" alt="${alt}" loading="lazy" decoding="async">`;
}

module.exports = imageElement;
