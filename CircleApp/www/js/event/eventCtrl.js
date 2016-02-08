var myApp = angular.module('starter.controllers')

myApp.controller('EventCtrl', function($scope, $rootScope, $ionicPopover) {
	$scope.events = [];

	$ionicPopover.fromTemplateUrl('templates/plus-button-event-popover.html', {
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
		var eventsTable = mobileService.getTable('event');
		eventsTable.read().done(function(results) {
			$scope.$apply(function() {
				$scope.events = results;
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
