const expect = require('expect.js'),
    _ = require('lodash');


describe("Sound", function () {
    const Sound = require("../sound");

    describe("toJSON()", function () {

        it("returns a plain object", function () {
            const mp3Meta = new Sound({
                title: 'test title',
                artist: 'test artist',
                genre: 'test genre'
            });
            expect(_.isPlainObject(mp3Meta.toJSON())).to.be(true, 'result should be plain object');
        });
    });

});
