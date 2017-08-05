const _ = require('lodash');
const Debuggable = require('debuggable');

class Sound extends Debuggable {

    /**
     *
     * @param {Object} mp3Meta
     * @param {Object} [options]
     * @constructor
     */
    constructor(mp3Meta, options) {
        super({
            debugTag: 'Sound: ',
            debugLevel: Debuggable.PROD
        });
        this.meta = mp3Meta;
        this.config = _.defaults(options, {
            artworkURL: this.meta['artwork_url'],
            artworkExtension: '.jpg'
        });

    }

    /**
     *
     * @returns {Object}
     */
    getMeta(){
        return this.meta;
    }

    get(key){
        return this.meta[key];
    }

    set(key, val){
        return this.meta[key] = val;
    }

    getId(){
        return this.meta.id;
    }

    getTitle(){
        return this.meta.title;
    }

    getArtworkURL(){
        return this.meta['artwork_url'];
    }

    toJSON(){
       return this.meta;
    }

    isValid() {
        return !!this.meta['stream_url'];
    }
}

module.exports = Sound;
