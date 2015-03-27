app.get('/', function(req, res) {
	if (req.user) { // Logged in
		res.render('pages/frontpage');
	} else {
		res.render('pages/login');
	}
});
