var _ = require('lodash');
var path = require('path');
var fs = require('fs');

// Determine 'ENV' {{{
var env = 'dev';
if (process.env.VCAP_SERVICES) {
	env = 'appfog';
} else if (process.env.OPENSHIFT_NODEJS_IP) {
	env = 'openshift';
} else if (process.env.MONGOLAB_URI) {
	env = 'heroku';
} else if (process.env.NODE_ENV) { // Inherit from NODE_ENV
	env = process.env.NODE_ENV;
}
// }}}

var defaults = {
	env: env,
	root: path.normalize(__dirname + '/..'),
	host: null, // Listen to all host requests
	port: process.env.PORT || 4000,
	url: 'http://localhost',
	secret: "This is a secret, there are many like it but this one is mine",
	deploy: {
		appfog: {
			profile: 'stem',
		},
	},
	mongo: {
		uri: 'mongodb://localhost/stem',
		options: {
			db: {
				safe: true
			}
		}
	},
	cron: {
		execute: {
			enabled: true,
			intervalStart: 1 * 1000,
			interval: 10 * 1000,
		}
	},
	agent: {
		timeout: 10 * 1000,
	},
};

module.exports = _.merge(
	defaults,
	fs.existsSync('./config/private.js') ? require('./private.js') : {},
	fs.existsSync('./config/' + defaults.env + '.js') ? require('./' + defaults.env + '.js') : {}
);
