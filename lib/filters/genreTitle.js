
module.exports = (tag) => {

  if (typeof tag !== 'string' || tag.length < 1){return tag;}
  
  let specialTags = {'r b': "R & B",
                     'contemporary r b': "Contemporary R & B",
                     'heavy metal': "Heavy Metal 🤟",
                     'blue eyed soul': "Blue-eyed Soul",
                     'disco': "Disco 🕺",
                     'rock and roll': "Rock and Roll",
                     'west coast hip hop': "West-coast Hip Hop"}
  if (tag in specialTags){return specialTags[tag];}

  return tag.split(' ')
     .map(w => w[0].toUpperCase() + w.substring(1).toLowerCase())
     .join(' ');

};
