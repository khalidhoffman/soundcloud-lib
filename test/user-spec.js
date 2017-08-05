const path = require('path');
const util = require('util');
const chai = require('chai');
const _ = require('lodash');

const expect = chai.expect;

describe.skip("User", function () {
	const User = require('../user');

	const testUserName = 'khalidhoffman';
	const testUserOptions = {
		cachePath: path.join(process.cwd(), '/public/data/'),
		saveDir: path.join(process.cwd(), "/public/media/")
	};
	const testUser = new User(testUserName, testUserOptions);

	it("can find union of 'Cruise' and '4' playlist", function () {

		return testUser.getPlayLists()
			.then(function (err, playLists) {
				let mostPopularSongs = _.chain(playLists)
					.reduce((collection, playlist) => {
						if (playlist.getTitle().match(/(cruise)|(^4$)/i)) {
							collection.push(playlist);
						}
						return collection;
					}, [])
					.map((playlist) => {
						return playlist.getSounds().map(function (sound) {
							return {
								id: sound.getId(),
								title: sound.get('title')
							}
						});
					})
					.intersectionBy('id')
					.map(sound => sound.title)
					.value();

				console.log(`union: (${mostPopularSongs.length}):\n${util.inspect(mostPopularSongs, {colors: true})}`);
			})

	});

	describe("getPlayLists()", function () {

		it("passes an array of playlists", function () {
			return testUser.getPlayLists()
				.then(function (playLists) {
					expect(playLists).to.exist;
					expect(playLists).to.be.an('array');
				});
		})
	});

});
