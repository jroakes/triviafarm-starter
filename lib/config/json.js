const fs = require('fs');

module.exports = (config) => {

  config.setDataDeepMerge(true);

  config.addTemplateFormats('json');

	config.addExtension('json', {
		compile: (input) => {
			return (data) => {
				return input;
			}
		},
		getData: (inputPath) => {
			let trivia = JSON.parse(fs.readFileSync(inputPath, {encoding:'utf8', flag:'r'}));
			// lowercase keys and remove spaces
			for(let key of Object.keys(trivia)) trivia[key.toLowerCase().replace(/ /g,'')] = trivia[key];

      return trivia;
		}

	});

}
