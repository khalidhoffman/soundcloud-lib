const fs = require('fs');
const path = require('path');
const assert = require("assert");

const SoundCollection = require('../sound-collection');

const playlistsTestData = (function () {
	let testPlaylistData = [{tracks: [{id: 1}, {id: 2}]}];
	try {
		testPlaylistData = JSON.parse(fs.readFileSync(path.join(__dirname, './support/test-data.json')));
	} catch (err) {
		console.error(err);
	}
	return testPlaylistData;
})();

module.exports = {
	'SoundCollection': {
		'#setSounds()': {
			"can reorder a playlist": function () {
				const tPlaylist = new SoundCollection(playlistsTestData[0]);
				const newSounds = tPlaylist.getSounds().map((sound, index, sounds) => {
					if (index === 0) return sounds[1];
					if (index === 1) return sounds[0];
					return sound;
				});

				assert(tPlaylist.getSounds()[0].get('id') !== newSounds[0].get('id'));
				assert(tPlaylist.getSounds()[1].get('id') !== newSounds[1].get('id'));

				// set new sounds
				tPlaylist.setSounds(newSounds);

				assert(tPlaylist.getSounds()[0].get('id') === newSounds[0].get('id'));
				assert(tPlaylist.getSounds()[1].get('id') === newSounds[1].get('id'));

			}
		}
	}
};
