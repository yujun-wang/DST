var users = require('../models/users');

// FIXME: Security needed here to ensure only admins can get CRUD access
restify.serve(app, users);

app.post('/login',
    passport.authenticate('local'),
    function(req, res) {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        res.json(req.user);
        res.redirect('/');
    });

app.get('/login', function(req, res) {
	console.log("req.user:",req.user);
	if (req.user) // Already logged in
		return res.redirect('/');

	res.render('pages/login', {
		namespace: 'plain',
		message: req.flash('passportMessage')
	});
});

app.get('/sign_up', function(req, res) {
	if (req.user) // Already logged in
		return res.redirect('/');

	res.render('partials/register', {
		namespace: 'plain',
		message: req.flash('passportMessage')
	});
});

app.post('/api/users/logout', passport.authenticate('local'), function(req, res) {
	req.logout();
	res.json();
});


app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

app.get('/api/profile', function(req, res) {
	res.json(req.user ? req.user.data : null);
});

app.get('/api/users/:id', function(req, res) {
	var id = req.params.id;
	users.findOne({'_id': req.params.id }, function(err, item) {
		res.send(item).end();
	});
});
 
app.get('/api/users', function(req, res) {
	// FIXME: This needs to be for [type=admin] only
	model.find({}).exec(function(err, items) {
		res.json(items);
	});
});

app.post('/api/users/create', function(req, res) {
	var data = req.body;
	console.log('Adding user: ' + JSON.stringify(data));
	model.create(data, function(err, result) {
		if (err) {
			res.send({error: 'An error has occurred'}).end();
		} else {
			console.log('Success: ' + JSON.stringify(result[0]));
			res.send(result[0]).end();
		}
	});
});

app.put('/api/users/:id', function(req, res) {
	var id = req.params.id;
	var data = req.body;
	console.log('Updating user: ' + id + ' with', JSON.stringify(data));
	model.update({'_id': id}, data, function(err, result) {
		if (err) {
			console.log('Error updating user: ' + err);
			res.send({'error': 'An error has occurred'}).end();
		} else {
			res.send(data).end();
		}
	});
});
