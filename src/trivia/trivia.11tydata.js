const slugNormalize = require('../../lib/filters/slugNormalize')
const { imageURL } = require('../../lib/config/imageElement')

const makeURL = (url) => {
  return url.substring(0,4) == 'http' ? url : 'https://'+url;
}

const isUrlValid = (url, match) => {
  return (typeof url === 'string' && url.indexOf(match) > -1) ? true : false;
}


module.exports = {
  layout: 'trivia',
  title: 'Untitled',
  eleventyComputed: {
    title: (data) => `${data.name} Trivia Q&A`,
    description: (data) => `See who knows more about ${data.name}! Trivia questions pulled from popular websites by language models.`,
    genres: (data) => data.genres.filter(t => {return typeof t === 'string' && t.length > 0}),
    tags: (data) => data.genres.filter(t => {return typeof t === 'string' && t.length > 0}),
    genres: (data) => [... new Set(data.genres)],
    canonical: (data) => data.site.url + data.page.url,
    permalink: (data) => {
      let pl = slugNormalize(data.page.fileSlug);
      return `${pl}/index.html`;
    },
    debug: (data) => JSON.stringify(data),
    featuredImageURL: (data) => data.featured_image.image_file_url,
    featuredLocalImage: (data) => data.featured_image.image_file_url ? imageURL(data.featured_image.image_file_url) : "",
    featuredImageAlt: (data) => `Artist Image: ${data.name}`,
    featuredImageAttribution: (data) => {
      let attribution = data.featured_image.attribution_html;
      if (attribution){
        attribution = attribution.replace(/<a[^>]+ebay\.com[^<]+<\/a>/ig, "");
        attribution = attribution.replace(/(<p>|<\/p>|<br>|<\/br>)/ig, "");
        return  `<cite>${attribution}</cite>`;
      }
      return null;
    },
    websiteURL: (data) => (typeof data.website === 'string' && data.website.length > 5) ? makeURL(data.website) : null,
    faqPageSchema: (data) => {

      let t, unique= a=> ( t={}, a.filter(e=>!(t[e.query]=e.query in t)) );
      let qas = unique(data.questions);

      let entities = qas.map((el) => {
                                      return {"@type": "Question",
                                              "name": el.query,
                                              "acceptedAnswer": {
                                                                  "@type": "Answer",
                                                                  "text": el.answer,
                                                                  "abstract": el.context
                                                                }
                                              };
                                    });

      let faqPage = JSON.stringify({
                      "@context": "https://schema.org",
                      "@type": "FAQPage",
                      "name": `${data.name} FAQs`,
                      "mainEntity": entities
                    });

      return `<script type="application/ld+json">${faqPage}</script>`;
    },
    questions: (data) => {
      let t, unique= a=> ( t={}, a.filter(e=>!(t[e.query]=e.query in t)) );
      return unique(data.questions);
    },
    social: (data) => {

      let youtube = data.social_media_youtube_channels.length > 0 ? data.social_media_youtube_channels[0] : "";
      return {
        facebook: isUrlValid(data.social_media_facebook, 'facebook.com') ? makeURL(data.social_media_facebook) : false,
        twitter:  isUrlValid(data.social_media_twitter, 'twitter.com') ? makeURL(data.social_media_twitter) : false,
        instagram: isUrlValid(data.social_media_instagram, 'instagram.com') ? makeURL(data.social_media_instagram) : false,
        youtube:  isUrlValid(youtube, 'youtube.com') ? makeURL(youtube) : false
      };
    }
  }
};
