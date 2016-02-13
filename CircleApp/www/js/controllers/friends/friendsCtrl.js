var myApp = angular.module('starter.controllers')

myApp.controller('FriendsCtrl', function($scope, $rootScope, $ionicPopover) {
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
		var mobileService = $rootScope.client;
		var eventsTable = mobileService.getTable('friend');
		eventsTable.read().done(function(results) {
            console.log(results);
			$scope.$apply(function() {
				$scope.friends = results;
			});
			$scope.$broadcast('scroll.refreshComplete');
		}, function(err) {
			console.log("Error: " + err);
		});
	};

	$scope.$on('$ionicView.enter', function(e) {
		$scope.query();
	});
})
