app.controller('loginController', function($scope, $rootScope, $document, $timeout, $location, User) {
	$scope.username = '';
	$scope.passsword = '';
	$scope.error = '';

	$scope.doLogin = function() {
		User.login({
			username: $scope.username,
			password: $scope.password
		}).$promise
			.then(function(user) {
				console.log("doLogin:",user);
				if (user._id) {
					$rootScope.setUser(user);
					window.location.replace("/");
				} else {
					$scope.error = 'Invalid username or password';
					console.log("$root.user:",$rootScope.user);
					console.log($scope.error);
				}
			});
	};

	$scope.doSignUp = function (form) {
        if (form.$valid) {
            var user = new User();
            // Clean errors array
            $scope.errors = [];

            if (form.$valid) {
                // check if password and password copy match
                if (form.password && form.passwordRepeat && form.passwordRepeat.$modelValue === form.password.$modelValue) {

                } else {
                    $scope.errors.push('passwordsDoesNotMatch');
                }

                // If there is no errors,
                if ($scope.errors.length == 0) {
                    var user = new User();
                    // Fill user with information
                    user.username = $scope.username;
                    user.first_name = $scope.first_name;
                    user.last_name = $scope.last_name;
                    user.dateOfBirth = $scope.dateOfBirth;
                    user.password = $scope.password;
                    user.role = 'user';

                    user.$save(function (user) {
                        console.log('User was succesfully created', user);
                        $rootScope.user = user;
                        $scope.doLogin();
                    }, function (error) {
                        console.error("Failed to create user because of",  error);
                        console.log(error.data.code);
                        if (error.data.code === 11000) {
                            $scope.displayMessage = 'User with this email already exists in our system'
                        }
                    });
                }
            }

        }
    }

	var bindingForAppleDevice = function () {
		$document.bind("keydown", function (event) {
			if (event.keyCode === 20) { setCapsLockOn(true); };
		});

		$document.bind("keyup", function (event) {
			if (event.keyCode === 20) { setCapsLockOn(false); };
		});

		$document.bind("keypress", function (event) {
			var code = event.charCode || event.keyCode;
			var shift = event.shiftKey;

			if (code > 96 && code < 123) { setCapsLockOn(false); }
			if (code > 64 && code < 91 && !shift) { setCapsLockOn(true); }
		});
	}

	var bindingForOthersDevices = function () {
		var isKeyPressed = true;

		$document.bind("keydown", function (event) {
			if (!isKeyPressed && event.keyCode === 20) {
				isKeyPressed = true;
				if ($rootScope.isCapsLockOn != null) { setCapsLockOn(!$rootScope.isCapsLockOn); };
			};
		});

		$document.bind("keyup", function (event) {
			if (event.keyCode === 20) { isKeyPressed = false; };
		});

		$document.bind("keypress", function (event) {
			var code = event.charCode || event.keyCode;
			var shift = event.shiftKey;

			if (code > 96 && code < 123) { setCapsLockOn(shift); }
			if (code > 64 && code < 91) { setCapsLockOn(!shift); }
		});
	}

	if (/Mac|iPad|iPhone|iPod/.test(navigator.platform)) {
		bindingForAppleDevice();
	} else {
		bindingForOthersDevices();
	}

	var setCapsLockOn = function (isOn) {
		$timeout(function() {
			$rootScope.isCapsLockOn = isOn;
		});
	};
});
