const _ = require('lodash'),

    Debuggable = require('debuggable'),
    SoundMeta = require('./sound-meta');

class Sound extends Debuggable {

    /**
     *
     * @param {SoundMeta} mp3Meta
     * @param {String} url
     * @param {Object} [options]
     * @constructor
     */
    constructor(mp3Meta, url, options) {
        super({
            debugTag: 'Sound: ',
            debugLevel: Debuggable.PROD
        });
        this.meta = mp3Meta instanceof SoundMeta ? mp3Meta : new SoundMeta(mp3Meta);
        this.config = _.defaults(options, {
            artworkURL: this.meta.get('artwork_url'),
            artworkExtension: '.jpg',
            url : url
        });

    }

    /**
     *
     * @returns {SoundMeta}
     */
    getMeta(){
        return this.meta;
    }

    get(key){
        return this.meta[key];
    }

    getId(){
        return this.meta.id;
    }

    getArtworkURL(){
        return this.meta['artwork_url'];
    }

    toJSON(){
       return this.meta;
    }

    isValid() {
        return !!this.meta.get('stream_url');
    }
}

module.exports = Sound;
