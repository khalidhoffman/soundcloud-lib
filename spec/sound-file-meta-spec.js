const _ = require('lodash');

describe("SoundFileMeta", function () {
    const SoundFileMeta = require("../../../lib/soundcloud/sound-file-meta.js");

    describe("sanitizeID3Text()", function () {

        it('sanitizes utf-8 fields for latin-1 standards', function () {
            const result = SoundFileMeta.sanitizeID3Text("The Weeknd — -Often?");
            expect(result).toContain('The Weeknd');
            expect(result).toContain('-Often');
            expect(result).not.toContain('—');
            // expect(result).not.toContain('?');
        });
    });

    describe("toJSON()", function () {

        it("returns a plain object", function () {
            const mp3Meta = new SoundFileMeta({
                title: 'test title',
                artist: 'test artist',
                genre: 'test genre'
            });
            expect(_.isPlainObject(mp3Meta.toJSON())).toBe(true, 'result should be plain object');
        });
    });

});
