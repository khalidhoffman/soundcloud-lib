const _ = require('lodash'),

    Sound = require('./sound'),
    SoundMeta = require('./sound-meta');

class SoundCollection {
    /**
     *
     * @param config
     * @param config.meta
     * @param config.clientId
     */
    constructor(config) {
        const defaults = {
            meta: {
                title: 'n/a',
                tracks: []
            },
            local: true
        };

        this.config = _.defaults(config, defaults);
        this.meta = this.config.meta;
        this.sounds = this.config.meta.tracks.map((songMeta) => {
            if (!songMeta['stream_url']) console.warn('invalid song found: %s', songMeta.title);
            return new SoundMeta(songMeta)
        });
    }

    getSounds() {
        return this.sounds;
    }

    /**
     *
     * @param {SoundMeta[]|SoundFileMeta[]|Object[]} sounds
     */
    setSounds(sounds) {
        this.sounds = sounds.map((sound) => {
            if (sound instanceof SoundMeta) {
                return sound
            } else if (sound instanceof Sound) {
                return sound.getMeta();
            } else {
                return new SoundMeta(sound);
            }
        });
    }

    toJSON() {
        return this.meta;
    }

    toArray() {
        return this.sounds;
    }

    getTitle() {
        return this.meta.title;
    }

}

module.exports = SoundCollection;
