app.config(function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/demo', {templateUrl: "/partials/demo.html"})
		.when('/sign_up', {templateUrl: "/partials/register.html"})
		.when('/users/list', {templateUrl: "/partials/users/list.html"})
		.when('/users/edit/:id', {templateUrl: "/partials/users/edit.html"})
		.otherwise({templateUrl: "/partials/frontpage.html"});
});
