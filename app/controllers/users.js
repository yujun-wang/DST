app.controller('userListController', function($scope, $routeParams, $location, User) {
	$scope.users = [];

	$scope.refresh = function() {
		$scope.users = User.query();
	};
	$scope.refresh();

	// Edit button handler
    $scope.editUser = function (user) {
        $location.path("/users/edit/" + user._id);
    };

     // Delete user handler
    $scope.deleteUser = function (user) {
        if ( confirm("Are you sure you want to delete " + user.name + "?") ){
            user.$delete({_id: user._id});
            $scope.refresh();
        }
    };
});

app.controller('userEditController', function($scope, $routeParams, $location, User) {
	// Hardcode user types
    $scope.roles = [{
        role: "root",
        name: "System Adminstrator"
    },
    {
        role: "admin",
        name: "Administrator"
    },
    {
        role: "user",
        name: 'User'
    }];

	$scope.user = { // Prototype user used when creating new users - set defaults here
		_id: '_new'
	};
	if (!$routeParams.id) // No ID - send back to list
		$location.path('/');
	if ($routeParams.id != 'new') // Not creating a new one? Go fetch it by its ID
		$scope.user = User.get({id: $routeParams.id});

	$scope.saving = false;
	$scope.save = function() {
		$scope.saving = true;
		var query = {};

		if ($scope.user._id != '_new') // Save over existing
			query.id = $scope.user._id;

		User.save(query, $scope.user).$promise.then(function() {
			$location.path("/users/list"); // Redirect back to list when done
		});
	};

	// return to previous page
    $scope.back = function () {
      window.history.back();
    };
});

app.controller('userDeleteController', function($scope, $routeParams, $location, $timeout, User) {
	if (!$routeParams.id) // No ID - send back to list
		$location.path('/users');
	User.delete({_id: $routeParams.id}).$promise.then(function() {
		$timeout(function() { // Timeout added for purely aesthetic reasons
			$location.path('/users'); // Redirect back to list
		}, 3000);
	});
});
