const path = require('path'),
    util = require('util'),
    expect = require('expect.js'),
    _ = require('lodash');

describe("User", function () {
    const User = require('../user'),
        testUserOptions = {
            cachePath: path.join(process.cwd(), '/public/data/'),
            saveDir: path.join(process.cwd(), "/public/media/")
        },
        testUser = new User('khalidhoffman', testUserOptions);

    it.skip("can find union of 'Cruise' and '4' playlist", function (done) {

        testUser.getPlayLists(function (err, playLists) {
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
                .value();

            mostPopularSongs = _.intersectionBy(...mostPopularSongs, 'id')
                .map(sound => sound.title);

            console.log(`union: (${mostPopularSongs.length}):\n${util.inspect(mostPopularSongs, {colors: true})}`);
            done();
        })

    });

    describe.skip("getPlayLists()", function () {

        it("returns an array of playlists", function (done) {
            testUser.getPlayLists(function (err, playLists) {
                if (err) throw err;
                expect(playLists).not.toBeUndefined();
                expect(_.isArray(playLists)).toBe(true, 'playLists should be an array');

                done();
            });
        })
    });

});
