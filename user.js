const util = require('util'),

    request = require('superagent'),
    _ = require('lodash'),

    SoundFilePlayList = require('./sound-collection');

class User {

    /**
     *
     * @param {String} [username]
     * @param [options]
     * @param [options.cachePath]
     * @param [options.clientId]
     * @param [options.meta]
     * @param [options.saveDir]
     * @constructor
     */
    constructor(username, options) {
        this._config = _.defaults(_.isString(username) ? options : username, {
            clientId: 'INVALID_SOUNDCLOUD_CLIENT_ID',
            meta: {
                permalink_url : `http://soundcloud.com/${username}`
            }
        });

        this.setUserMeta(this._config.meta);
        this.playLists = [];
    }

    _onError(err) {
        console.error(err);
        return Promise.reject(err);
    }


    /**
     *
     * @returns {Promise}
     * @private
     */
    _getPlayLists() {
        return new Promise((resolve, reject) => {
            request.get(`${this.apiURL}/playlists`)
                   .query({client_id: this._config.client_id})
                   .end((err, response, body) => {
                       if (err) {
                           reject(err);
                       } else if (response.statusCode < 400) {
                           this.playLists = _.chain(JSON.parse(body))
                               .uniqBy(function (playListMeta) {
                                   return playListMeta.title
                               })
                               .map((playlistMeta) => {
                                   return new SoundFilePlayList({
                                       meta: playlistMeta,
                                       clientId: this._config.clientId,
                                       saveDir: this._config.saveDir,
                                       local: this._config.local
                                   })
                               })
                               .value();
                           resolve(this.playLists);
                       } else {
                           const serverError = new Error(`Server returned error code: ${response.statusCode}`);
                           reject(serverError);
                       }
                   })
        })
    }

    /**
     *
     * @returns {Promise}
     */
    fetchUserMeta() {
        let self = this;
        return new Promise((resolve, reject) => {
            if (!this.isLoggedIn()) {
                request.get('http://api.soundcloud.com/resolve/')
                       .query({
                           url: this.userURL,
                           client_id:this._config.clientId
                       })
                       .end((err, response, body) => {
                           if (err) {
                               reject(err);
                           } else if (response.statusCode < 400) {
                               this.setUserMeta(JSON.parse(body));
                               resolve(this.meta)
                           } else {
                               reject(new Error("Server denied request"));
                           }
                       })
            } else {
                resolve(this.meta);
            }
        });

    }

    /**
     *
     * @returns {Promise}
     */
    login() {
        return this.fetchUserMeta();
    }

    isLoggedIn() {
        return !!this.meta.id;
    }

    /**
     *
     * @param {Object} data should be unadulterated soundcloud data
     */
    setUserMeta(data) {
        this.meta = data;
        if (this.meta.permalink_url) this.userURL = this.meta.permalink_url;
        if (this.meta.uri) this.apiURL = this.meta.uri;
    }

    /**
     *
     * @returns {Promise}
     */
    getPlayLists() {
        return this.login()
                   .then(() => this._getPlayLists())
                   .catch(this._onError);
    }
}

module.exports = User;
