var mongoose = require('mongoose');

/**
 * Configuration.
 */

var clientModel = require('./model/client'),
	tokenModel = require('./model/token'),
	userModel = require('./model/user');

/**
 * Add example client and user to the database (for debug).
 */

var loadExampleData = function() {

	var client1 = new clientModel({
		id: 'application',
		clientId: 'application',
		clientSecret: 'secret',
		grants: [
			'password',
			'refresh_token'
		],
		redirectUris: []
	});

	var client2 = new clientModel({
		clientId: 'confidentialApplication',
		clientSecret: 'topSecret',
		grants: [
			'password',
			'client_credentials'
		],
		redirectUris: []
	});

	var user = new userModel({
		username: 'pedroetb',
		password: 'password'
	});

	client1.save(function(err, client) {

		if (err) {
			return console.error(err);
		}
		console.log('Created client', client);
	});

	user.save(function(err, usr) {

		if (err) {
			return console.error(err);
		}
		console.log('Created user', usr);
	});

	client2.save(function(err, client) {

		if (err) {
			return console.error(err);
		}
		console.log('Created client', client);
	});
};

/**
 * Dump the database content (for debug).
 */

var dump = function() {

	clientModel.find(function(err, clients) {

		if (err) {
			return console.error(err);
		}
		console.log('clients', clients);
	});

	tokenModel.find(function(err, tokens) {

		if (err) {
			return console.error(err);
		}
		console.log('tokens', tokens);
	});

	userModel.find(function(err, users) {

		if (err) {
			return console.error(err);
		}
		console.log('users', users);
	});
};

/*
 * Methods used by all grant types.
 */

var getAccessToken = function(token, callback) {

	tokenModel.findOne({
		accessToken: token
	}).lean().exec((function(callback1, err, token1) {

		if (!token) {
			console.error('Token not found');
		}

		callback(err, token1);
	}).bind(null, callback));
};

var getClient = function(clientId, clientSecret, callback) {

	clientModel.findOne({
		clientId: clientId,
		clientSecret: clientSecret
	}).lean().exec((function(callback1, err, client) {

		if (!client) {
			console.error('Client not found');
		}

		callback(err, client);
	}).bind(null, callback));
};

var saveToken = function(token, client, user, callback) {

	token.client = {
		id: client.clientId
	};

	token.user = {
		username: user.username
	};

	var tokenInstance = new tokenModel(token);
	tokenInstance.save((function(callback1, err, token1) {

		if (!token) {
			console.error('Token not saved');
		} else {
			token = token.toObject();
			delete token._id;
			delete token.__v;
		}

		callback(err, token1);
	}).bind(null, callback));
};

/*
 * Method used only by password grant type.
 */

var getUser = function(username, password, callback) {

	userModel.findOne({
		username: username,
		password: password
	}).lean().exec((function(callback1, err, user) {

		if (!user) {
			console.error('User not found');
		}

		callback(err, user);
	}).bind(null, callback));
};

/*
 * Method used only by client_credentials grant type.
 */

var getUserFromClient = function(client, callback) {

	clientModel.findOne({
		clientId: client.clientId,
		clientSecret: client.clientSecret,
		grants: 'client_credentials'
	}).lean().exec((function(callback1, err, client1) {

		if (!client1) {
			console.error('Client not found');
		}

		callback(err, {
			username: ''
		});
	}).bind(null, callback));
};

/*
 * Methods used only by refresh_token grant type.
 */

var getRefreshToken = function(refreshToken, callback) {

	tokenModel.findOne({
		refreshToken: refreshToken
	}).lean().exec((function(callback1, err, token) {

		if (!token) {
			console.error('Token not found');
		}

		callback(err, token);
	}).bind(null, callback));
};

var revokeToken = function(token, callback) {

	tokenModel.deleteOne({
		refreshToken: token.refreshToken
	}).exec((function(callback1, err, results) {

		var deleteSuccess = results && results.deletedCount === 1;

		if (!deleteSuccess) {
			console.error('Token not deleted');
		}

		callback(err, deleteSuccess);
	}).bind(null, callback));
};

/**
 * Export model definition object.
 */

module.exports = {
	getAccessToken: getAccessToken,
	getClient: getClient,
	saveToken: saveToken,
	getUser: getUser,
	getUserFromClient: getUserFromClient,
	getRefreshToken: getRefreshToken,
	revokeToken: revokeToken
};
