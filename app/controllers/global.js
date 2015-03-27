// App global controller (also $rootScope)
app.controller('globalController', function($scope, $rootScope, $location, User) {
	// .user {{{
	User.profile().$promise.then(function(data) {
		$scope.setUser(data);
	});
	$rootScope.setUser = function(user) {
		$rootScope.user = user;
		console.log('path:',window.location.pathname);
		console.log('$rootScope.user:',$rootScope.user);
		if ((!user || !user.username) && window.location.pathname != '/login' && window.location.pathname != '/sign_up') {
			window.location = '/login';
			return;
		}
		if (!$rootScope.user.settings)
			$rootScope.user.settings = {};
		_.defaults($rootScope.user.settings, { // Default user options
		});
		$rootScope.$broadcast('changeUser', $scope.user);
	};

	$scope.doLogout = function() {
		console.log("logout!");
		User.logout({}).$promise
			.then(function(user) {
				console.log("after;");
				$rootScope.setUser(null);
				$location.path('/');
			});
	};
	// }}}

	$scope.toggleSidebar = function() {
		if ($(window).width() < 769) {
		    $("body").toggleClass("show-sidebar");
		} else {
		    $("body").toggleClass("hide-sidebar");
		}
	};
});
