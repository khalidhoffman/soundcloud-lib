const path = require('path'),

    _ = require('lodash');

describe("Downloadable", function () {
    const Downloadable = require('../../../lib/soundcloud/downloadable');

    it("throws an error when no url is specified", function () {

        expect(function () {
            const tDownloadable = new Downloadable({
                fileDir: path.join(process.cwd(), '/public/images/test'),
                fileExtension: '.jpg'
            });
        }).toThrow();
    });

    describe("getFilePath()", function () {
        it('returns a string', function () {
            const tDownloadable = new Downloadable({
                fileDir: path.join(process.cwd(), '/public/images/test'),
                url: 'http://placehold.it/500x500',
                fileExtension: '.jpg'
            });

            expect(tDownloadable.getFilePath()).toMatch(/500/);
        })
    });

    describe("download()", function () {

        it("calls options.done when complete", function (done) {
            const tDownloadable = new Downloadable({
                fileDir: path.join(process.cwd(), '/public/images/test'),
                url: 'http://placehold.it/500x500',
                fileExtension: '.jpg'
            });

            tDownloadable.download({
                done: function (err) {
                    if (err) {
                        throw err;
                    }
                    done();
                }
            })
        });
    });

    describe("isSaved()", function () {

        it("returns true if the file has been saved", function (done) {

            const tDownloadable = new Downloadable({
                fileDir: path.join(process.cwd(), '/public/images/test'),
                url: 'http://placehold.it/500x500',
                fileExtension: '.jpg'
            });

            tDownloadable.download({
                done: function (err) {
                    if (err) {
                        throw err;
                    }
                    expect(tDownloadable.isSaved()).toBe(true);
                    done();
                }
            })

        });

        it("returns false if the file has not been saved", function () {

            const tDownloadable = new Downloadable({
                fileDir: path.join(process.cwd(), '/public/images/test'),
                url: 'http://placehold.it/300x300',
                fileExtension: '.jpg'
            });

            expect(tDownloadable.isSaved()).toBe(false);
        })
    })
});
