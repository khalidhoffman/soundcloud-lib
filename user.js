const url = require('url');
const request = require('superagent');
const formurlencoded = require('form-urlencoded');
const _ = require('lodash');

const SoundCollection = require('./sound-collection');

class User {

	/**
	 *
	 * @param {String} [username]
	 * @param {Object} [options]
	 * @param {String} [options.cachePath]
	 * @param {String} [options.clientId]
	 * @param {Object} [options.meta]
	 * @param {String} [options.saveDir]
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
		this.playlists = [];
	}

	/**
	 *
	 * @returns {Promise}
	 * @private
	 */
	_onError(err) {
		console.error(err);
		return Promise.reject(err);
	}

	/**
	 *
	 * @returns {Promise}
	 * @private
	 */
	_getPlaylists() {
		return request.get(url.resolve(this._config.apiURL, `/me/playlists`))
			.query({
				client_id: this._config.clientId,
				oauth_token: this._config.accessToken
			})
			.then(response => {
				return this.playlists = _.chain(response.body)
					.uniqBy(function (playlistMeta) {
						return playlistMeta.title
					})
					.map((playlistMeta) => {
						return new SoundCollection(
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
	 * @param {Object|SoundCollection} playlist
	 * @returns {Promise}
	 * @private
	 */
	_updatePlaylist(playlist) {
		const accessibleProps = ['title', 'tracks'];
		const playlistMeta = playlist instanceof SoundCollection ? playlist.toJSON() : playlist;
		const playlistUri = playlistMeta.uri || `http://api.soundcloud.com/playlists/${playlistMeta.id}`;
		const formData = {
			playlist: _.chain(playlistMeta)
				.pick(playlistMeta, accessibleProps)
				.set('playlist.tracks', playlistMeta.tracks.map(track => _.pick(track, ['id'])))
				.value(),
			format: 'json',
			client_id: this._config.clientId,
			oauth_token: this._config.accessToken
		};
		const encodedFormData = formurlencoded(formData);

		return request.put(playlistUri)
			.set('Content-Type', 'application/x-www-form-urlencoded')
			.query({oauth_token: this._config.accessToken})
			.send(encodedFormData)
			.then(response => response.body);
	}

	/**
	 *
	 * @param {Object|SoundCollection} playlist
	 * @returns {Promise}
	 * @private
	 */
	_createPlaylist(playlist) {
		const accessibleProps = ['title', 'tracks'];
		const playlistMeta = playlist instanceof SoundCollection ? playlist.toJSON() : playlist;
		const formData = {
			playlist: _.chain(playlistMeta)
				.pick(playlistMeta, accessibleProps)
				.set('playlist.tracks', playlistMeta.tracks.map(track => _.pick(track, ['id'])))
				.value(),
			format: 'json',
			client_id: this._config.clientId,
			oauth_token: this._config.accessToken
		};
		const encodedFormData = formurlencoded(formData);

		return request.post('http://api.soundcloud.com/playlists/')
			.set('Content-Type', 'application/x-www-form-urlencoded')
			.query({oauth_token: this._config.accessToken})
			.send(encodedFormData)
			.then(response => response.body);
	}

	/**
	 *
	 * @returns {Promise.<Object>}
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
			.then(response => this.setUserMeta(response.body));

	}

	/**
	 *
	 * @returns {Promise.<Object>}
	 */
	login() {
		return this.fetchUserMeta();
	}

	/**
	 *
	 * @returns {Boolean}
	 */
	isLoggedIn() {
		return !!this.meta.id;
	}

	/**
	 *
	 * @param {Object} data - should be unadulterated soundcloud data
	 */
	setUserMeta(data) {
		this.meta = data;
		if (this.meta.permalink_url) this.userURL = this.meta.permalink_url;
		if (this.meta.uri) this.userURI = this.meta.uri;
		return this.meta;
	}

	/**
	 *
	 * @returns {Promise.<SoundCollection[]>}
	 */
	getPlaylists() {
		return this.login()
			.then(() => this._getPlaylists())
			.catch(this._onError);
	}

	/**
	 *
	 * @param {String} playlistName
	 * @returns {Promise.<SoundCollection>}
	 */
	getPlaylist(playlistName) {
		return this.getPlaylists()
			.then(playlists => {
				return _.find(playlists, (playlist => {
					return playlist.get('title') === playlistName;
				}));
			})
			.catch(this._onError);
	}

	/**
	 *
	 * @param {String} playlistName
	 * @returns {Promise.<Boolean>}
	 */
	hasPlaylist(playlistName) {
		return this.getPlaylist(playlistName)
			.then(playlist => !!playlist)
			.catch(this._onError);
	}

	/**
	 *
	 * @param {SoundCollection} playlist
	 * @returns {Promise}
	 */
	setPlaylist(playlist) {
		return this.login()
			.then(() => this._updatePlaylist(playlist))
			.catch(this._onError);
	}

	/**
	 *
	 * @param {SoundCollection} playlist
	 * @returns {Promise}
	 */
	createPlaylist(playlist) {
		return this.login()
			.then(() => this._createPlaylist(playlist))
			.catch(this._onError);
	}
}

module.exports = User;
