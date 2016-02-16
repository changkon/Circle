var myApp = angular.module('starter.controllers')

myApp.controller('FriendsCtrl', function($scope, $rootScope, $ionicPopover, $friend) {
	$scope.friends = [];

	$ionicPopover.fromTemplateUrl('templates/plus-button-friends-popover.html', {
		scope: $scope
	}).then(function(popover) {
		$scope.popover = popover;
		console.log(popover);
	});

	// plus button click
	$scope.plusActivate = function($event) {
		$scope.popover.show($event);
	};

    $scope.closePopover = function() {
      $scope.popover.hide();
    };

	//Cleanup the popover when we're done with it!
	$scope.$on('$destroy', function() {
		$scope.popover.remove();
	});

	$scope.query = function() {
    $scope.friends = $friend.getAllFriends();
    $scope.$apply();
    $scope.$broadcast('scroll.refreshComplete');
  };

	$scope.$on('$ionicView.enter', function(e) {
		if ($friend.empty()) {
			$scope.query();
		} else {
			$scope.friends = $friend.currentFriends();
		}
	});
})
