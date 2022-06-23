
module.exports = (slug) => {
  return slug.toLowerCase()
             .replace(/( |\_|[^\w]|\-{2,})/g, '-')
             .trim();
};
