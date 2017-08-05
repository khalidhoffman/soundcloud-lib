const url = require('url');
const request = require('superagent');
const form = require('form-urlencoded');
const _ = require('lodash'),

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
			accessToken: '',
			apiURL: 'https://api.soundcloud.com',
			meta: {
				permalink_url: `http://soundcloud.com/${username}`
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
		return request.get(url.resolve(this._config.apiURL, `/me/playlists`))
			.query({
				client_id: this._config.clientId,
				oauth_token: this._config.accessToken
			})
			.then(response => {
				return this.playLists = _.chain(response.body)
					.uniqBy(function (playListMeta) {
						return playListMeta.title
					})
					.map((playlistMeta) => {
						return new SoundFilePlayList(
							playlistMeta,
							{
								clientId: this._config.clientId,
								saveDir: this._config.saveDir,
								local: this._config.local
							})
					})
					.value();
			})
	}

	/**
	 *
	 * @param {Object|SoundCollection} playList
	 * @returns {Promise}
	 * @private
	 */
	_updatePlayList(playList) {
		const accessibleProps = ['title', 'tracks'];
		const playListMeta = playList instanceof SoundFilePlayList ? playList.toJSON() : playList;
		const formData = {
			playlist: _.pick(playListMeta, accessibleProps),
			format: 'json',
			client_id: this._config.clientId
		};

		return request.put(playListMeta.uri)
			.type('form')
			.query({
				oauth_token: this._config.accessToken
			})
			.send(form.encode(formData))
			.then((err, response) => {
				return response.body;
			})
	}

	/**
	 *
	 * @returns {Promise}
	 */
	fetchUserMeta() {
		if (this.isLoggedIn()) {
			return Promise.resolve(this.meta);
		}

		return request.get('http://api.soundcloud.com/resolve/')
			.query({
				url: this.userURL,
				client_id: this._config.clientId
			})
			.then(response => {
				this.setUserMeta(response.body);
				return this.meta
			})

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
		if (this.meta.uri) this.userURI = this.meta.uri;
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

	/**
	 *
	 * @param {SoundCollection} playList
	 * @returns {Promise}
	 */
	setPlayList(playList) {
		return this.login()
			.then(() => this._updatePlayList(playList))
			.catch(this._onError);
	}
}

module.exports = User;
