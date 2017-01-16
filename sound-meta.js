class SoundMeta {

    /**
     *
     * @param meta
     * @constructor
     */
    constructor(meta) {
        this.meta = meta;
    }

    static sanitizeID3Text(text) {
        // convert from UTF-8 to ISO-8859-1
        let output = '',
            i;
        for (i = 0; i < text.length; i++) {
            output += text.charCodeAt(i) <= 127 ? text.charAt(i) : '';
        }
        return output;
    }

    get(metaPropName) {
        return this.meta[metaPropName];
    }

    toJSON() {
        return this.meta;
    }

    getId() {
        return this.meta.id;
    }

    getTitle() {
        return this.meta.title;
    }

    getArtist() {
        return this.meta.artist;
    }
}

module.exports = SoundMeta;
