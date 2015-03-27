var fs = require('fs');

app.get('/debug/error', function(req, res) {
	res.render('pages/error', {
		message: 'This is a test error',
	});
});

app.get('/debug/ensure/login', ensure.login, function(req, res) {
	res.send('If you can see this message it means you are logged in').end();
});

app.all('/debug/echo', function(req, res) {
	var out  = {
		'POST': req.body,
		'GET': req.query,
	};
	console.log('DEBUG ECHO', out);
	res.send(out);
});

/**
* Base scenario loader
* This handler invokes mongoose-scenario to rebuild the database, similar to the `gulp db` command
*/
app.get('/debug/db', function(req, res) {
	require('../models');
	var scenario = require('mongoose-scenario');
	scenario(JSON.parse(fs.readFileSync('./models/scenarios/setup.json')), {
		connection: db,
		nuke: true,
	}, function(err, data) {
		if (err) return res.send({err: err}).end();
		res.send(data);
	});
});
