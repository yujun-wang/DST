var crypto = require('crypto');

var name = 'users';
var schema = new mongoose.Schema({
	id: mongoose.Schema.ObjectId,
	username: {type: String, required: true, index: {unique: true}},
	passhash: {type: String},
	passsalt: {type: String},
	first_name: {type: String},
    last_name: {type: String},
	status: {type: String, enum: ['active', 'deleted'], default: 'active'},
	role: {type: String, enum: ['user', 'admin', 'root'], default: 'user'},
	created: {type: Date, default: Date.now},
	auth: {
		dropbox: {
			accessToken: String,
			accessTokenSecret: String,
			requestToken: String,
			requestTokenSecret: String
		}
	}
});

// Deal with logins + user passwords {{{
schema
	.virtual('password')
	.set(function(password) {
		this.passsalt = crypto.randomBytes(16).toString('base64');
		this.passhash = this.encryptPass(this.passsalt, password);
	});

schema.methods.encryptPass = function(salt, password) {
	var saltBuffer = new Buffer(salt, 'base64')
	return crypto.pbkdf2Sync(password, saltBuffer, 10000, 64).toString('base64');
};

schema.methods.validPassword = function(candidate, next) {
	return next(null, this.encryptPass(this.passsalt, candidate) == this.passhash);
};
// }}}

schema.statics.findByLogin = function(req, username, password, next) {
	this
		.findOne({username: username})
		.exec(function (err, user) {
			if (err) return next(err);
			if (!user)
				return next(null, false, req.flash('passportMessage', 'Incorrect username'));
			user.validPassword(password, function(err, isMatch) {
				if (err) return next(err);
				if (!isMatch) return next(null, false, req.flash('passportMessage', 'Incorrect password'));
				return next(null, user);
			});
		});
};

schema.virtual('data') // user.data returns the public facing user profile (i.e. hide passwords and stuff frontend people shouldn't see)
	.get(function() {
		return {
			_id: this._id,
			username: this.username,
			name: this.name,
			role: this.role,
			userGroups: this.userGroups,
			auth: {
				dropbox: (!! this.auth.dropbox.accessTokenSecret)
			}
		};
	});

module.exports = mongoose.model(name, schema);
