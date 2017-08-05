const fs = require('fs');
const path = require('path');
const assert = require("assert");

const SoundCollection = require('../sound-collection');

const playListsTestData = (function () {
	let testData = [{tracks: [{id: 1}, {id: 2}]}];
	try {
		testData = JSON.parse(fs.readFileSync(path.join(__dirname, './support/test-data.json')));
	} catch (err) {
		console.error(err);
	}
	return testData;
})();

module.exports = {
	'SoundCollection': {
		'#setSounds()': {
			"should set meta data as well": function () {
				const tPlayList = new SoundCollection(playListsTestData[0]);
				const newSounds = tPlayList.getSounds().map((sound, index, sounds) => {
					if (index === 0) return sounds[1];
					if (index === 1) return sounds[0];
					return sound;
				});

				assert(tPlayList.getSounds()[0].get('id') !== newSounds[0].get('id'));
				assert(tPlayList.getSounds()[1].get('id') !== newSounds[1].get('id'));

				// set new sounds
				tPlayList.setSounds(newSounds);

				assert(tPlayList.getSounds()[0].get('id') === newSounds[0].get('id'));
				assert(tPlayList.getSounds()[1].get('id') === newSounds[1].get('id'));

			}
		}
	}
};
