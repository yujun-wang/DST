app.factory('User', function($resource) {
	return $resource('/api/users/:id', {}, {
		profile: {url: '/api/profile'},
		login: {url: '/login', method: 'post'},
		logout: {url: '/logout'}
	});
});
