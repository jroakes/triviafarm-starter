
const workbox = require('workbox-build');

module.exports = async (outputDir) => {

  const options = {
    cacheId: 'sw',
    skipWaiting: true,
    clientsClaim: true,
    swDest: `${outputDir}/sw.js`,
    globDirectory: outputDir,
    globPatterns: [
      '**/*.{html,css,js,mjs,map,jpg,png,gif,webp,ico,svg,woff2,woff,eot,ttf,otf,ttc,json}',
    ],
    runtimeCaching: [
      {
        urlPattern: /^.*\.(html|jpg|png|gif|webp|ico|svg|woff2|woff|eot|ttf|otf|ttc|json)$/,
        handler: `StaleWhileRevalidate`,
      }
    ],
  };

  const genSW = await workbox.generateSW(options);
  const size = (genSW.size / 1048576).toFixed(2);
  return `${genSW.count} files will be precached, totaling ${size} MB.`;
};
