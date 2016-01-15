
(function () {
	'use strict';
	angular.module('Codefun').controller('authController', authController);

	authController.$inject = ['$location', 'AuthenticationService','$scope','$rootScope','AUTH_EVENTS','$state','UserService'];
	function authController($location, AuthenticationService,$scope,$rootScope,AUTH_EVENTS,$state,UserService) {
		$scope.user = {};
		var locationUrl = $location;
		var searchObject = locationUrl.search();
		if(searchObject["token"] && searchObject["user"]) {
			$(".page-loading").removeClass("hidden");
			$scope.user.email = searchObject["user"];
			$scope.user.token = searchObject["token"];
			AuthenticationService.LoginUsingToken($scope.user.email, $scope.user.token, function(response){
				if(response.success) {
					$(".page-loading").addClass("hidden");
					AuthenticationService.SetCredentials(response.username,response.token);
					$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
					$state.go('welcome');
				} else {
					$(".page-loading").addClass("hidden");
					$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
					//FlashService.Error(response.message);
					$scope.loginerrormessage = "Failed to login in using other service providers";
				}
			});
		}

       $scope.user = {};
		$scope.register = function(form) {

			if(form.$invalid)
			{
				$scope.registersubmitted = true;
				return;
			}

			$(".page-loading")
			.removeClass("hidden");
			UserService.Create($scope.userData)
			.then(function (response) {
				if (response.success) {
					$(".page-loading")
					.addClass("hidden");
					$location.path('/login');
				} else {
					$(".page-loading")
					.addClass("hidden");
					$scope.registererrormessage = "Unable to resgister user"
						//FlashService.Error(response);
						$scope.dataLoading = false;
				}
			});
		};
		$scope.login = function(form) {
			if(form.$invalid)
			{
				$scope.loginsubmitted = true;
				return;
			}
			$(".page-loading").removeClass("hidden");
			AuthenticationService.Login($scope.userData.email, $scope.userData.password, function (response) {
				if (response.success) {
					$(".page-loading").addClass("hidden");
					AuthenticationService.SetCredentials($scope.userData.email, $scope.userData.password);
					$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
					$state.go('welcome');
				} else {
					$(".page-loading").addClass("hidden");
					$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
					//FlashService.Error(response.message);
					$scope.loginerrormessage = "The Password/Email you entered is incorrect";
				}
			});
		};

		$scope.resetPassword = function(form) {
			if(form.$invalid)
			{
				$scope.resetsubmitted = true;
				return;
			}
			$(".page-loading").removeClass("hidden");

			AuthenticationService.ResetPassword($scope.userData.email, function(response){
				//console.log(response);
				$(".page-loading")
				.addClass("hidden");
				$scope.resetmessage = "Reset password will be sent to your registered email id please check your email";
			});
		};

		$scope.changePassword = function(form) {
			if(form.$invalid ||  $scope.userData.newpassword2 != $scope.userData.newpassword1 )
			{
				$scope.changepasswordsubmitted = true;
				return;
			}
			$(".page-loading").removeClass("hidden");
			UserService.UserchangePassword($scope.userData.newpassword1,$rootScope.resetuseremail,$rootScope.userresettoken)
			.then(function(response) {
				$(".page-loading").addClass("hidden");
			});
		};

		$scope.signOut = function() {
			AuthenticationService.SignOut($scope.user.email, $scope.user.accessToken, function(response){
				//console.log(response);
			});
		};

	}
})();
