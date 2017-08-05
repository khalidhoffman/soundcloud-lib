const chai = require('chai');
const _ = require('lodash');

const expect = chai.expect;


describe("Sound", function () {
    const Sound = require("../sound");

    describe("toJSON()", function () {

        it("returns a plain object", function () {
            const mp3Meta = new Sound({
                title: 'test title',
                artist: 'test artist',
                genre: 'test genre'
            });
            expect(_.isPlainObject(mp3Meta.toJSON())).to.eql(true, 'result should be plain object');
        });
    });

});
