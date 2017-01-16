const path = require('path'),
    util = require('util'),
    _ = require('lodash'),
    config = require('../../../config');

describe("User", function () {
    const User = require('../../../lib/soundcloud/user'),
        testUserOptions = {
            cachePath: path.join(process.cwd(), '/public/data/'),
            clientId: config.SOUNDCLOUD_CLIENT_ID,
            saveDir: path.join(process.cwd(), "/public/media/")
        },
        testUser = new User('khalidhoffman', testUserOptions);

    xit("can find union of 'Cruise' and '4' playlist", function (done) {

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

    describe("getPlayLists()", function () {

        it("returns an array of playlists", function (done) {
            testUser.getPlayLists(function (err, playLists) {
                if (err) throw err;
                expect(playLists).not.toBeUndefined();
                expect(_.isArray(playLists)).toBe(true, 'playLists should be an array');

                done();
            });
        })
    });

    describe("downloadSound()", function () {
        let playLists;
        beforeAll(function (done) {
            testUser.getPlayLists(function (err, userPlayLists) {
                if (err) throw err;
                playLists = userPlayLists;
                done();
            });
        });

        it("runs a callback on completion", function (done) {
            const playlist = playLists[0],
                sounds = playlist.toArray(),
                testSound = sounds[0];

            testUser.downloadSound(testSound, function (err) {
                if (err) throw err;
                done();
            });
        })
    })
});
