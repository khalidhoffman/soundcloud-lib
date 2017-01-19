const _ = require('lodash'),

    Sound = require('./sound');

class SoundCollection {
    /**
     *
     * @param meta
     */
    constructor(meta) {
        this.meta = meta;
        this.sounds = this.meta.tracks.map((soundMeta) => {
            if (!soundMeta['stream_url']) console.warn('invalid song found: %s', soundMeta.title);
            return new Sound(soundMeta)
        });
    }

    getSounds() {
        return this.sounds;
    }

    /**
     *
     * @param {Sound[]|Object[]} sounds
     */
    setSounds(sounds) {
        this.sounds = sounds.map((sound) => {
            if (sound instanceof Sound) {
                return sound
            } else {
                return new Sound(sound);
            }
        });

        this.set('tracks', this.sounds.map(sound=> sound.toJSON()))
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

    get(propName){
        return this.meta[propName];
    }

    set(propName, val){
        return this.meta[propName] = val;
    }

}

module.exports = SoundCollection;
