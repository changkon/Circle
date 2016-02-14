var myApp = angular.module('starter.controllers')

myApp.controller('CircleCtrl', function($scope, $rootScope, $ionicPopover) {
    $scope.circles = [];

    $ionicPopover.fromTemplateUrl('templates/plus-button-circles-popover.html', {
			scope: $scope
		}).then(function(popover) {
			$scope.popover = popover;
		});

		// plus button click
		$scope.plusActivate = function($circle) {
			$scope.popover.show($circle);
		};

    $scope.closePopover = function() {
        $scope.popover.hide();
    };

		//Cleanup the popover when we're done with it!
		$scope.$on('$destroy', function() {
			$scope.popover.remove();
		});

    var getCircles = function() {
        var circleTable = $rootScope.client.getTable("circle");
				var query = circleTable.where({ /*initially just get all */ });
				query.read().then(function(circles) {
					$scope.circles = circles;
          $scope.$apply();
				}, function (error) {
						console.log("error retrieving circles");
				});
    };

	$scope.$on('$ionicView.enter', function(e) {
		getCircles();
	});
})
