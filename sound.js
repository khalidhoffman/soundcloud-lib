const _ = require('lodash');

class Sound {

    /**
     *
     * @param {Object} mp3Meta
     * @param {Object} [options]
     * @constructor
     */
	constructor(mp3Meta, options) {
		this.meta = mp3Meta;
		this.config = Object.assign({
			artworkURL: this.meta['artwork_url'],
			artworkExtension: '.jpg'
		}, options);
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
