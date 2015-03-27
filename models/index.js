var fs = require('fs');
var fspath = require('path');

// Run all scripts in this directory - i.e. lazy load all models into Mongoose
fs.readdirSync(__dirname).forEach(function (file) {
	if (/(.*)\.js$/.test(file) && file != 'index.js') {
		require(fspath.join(__dirname, file));
	}
});
