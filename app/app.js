var app = angular.module("app", [
	'ngResource',
	'ngRoute',
	'ui.gravatar',
	'uiSwitch'
]);

app.run(function($rootScope) {
	$rootScope.user = {};
});
