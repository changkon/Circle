var myApp = angular.module('starter.controllers')

myApp.controller('CircleCtrl', function($scope, $rootScope, $ionicPopover, $ionicPopup) {
    $scope.circles = [];
    $scope.pendingCircles = [];

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

    $scope.getCircles = function() {
      var mobileService = $rootScope.client;
      mobileService.invokeApi('CircleCustom/GetAllUserCircles', { method: 'GET' }).done(function (response) {
          $scope.circles = response.result.circles;
          $scope.pendingCircles = response.result.pendingCircles;
          $scope.$apply();
          console.log("successfully queried circles");
      }, function (error) {
          console.log(JSON.stringify(error));
      });
    };

  $scope.acceptCircleInvitation = function(circleId, circleName) {
    console.log(circleId);
		$ionicPopup.alert({
				title: 'Do you wish to be a part of this circle?',
				content: circleName
		}).then(function(res) {
				$rootScope.client.invokeApi("CircleCustom/PostAcceptCircleInvitation", {
		        method: 'POST',
		        body: { CircleId: circleId }
		    }).done(function (response) {
		        console.log("successfully updated circle")
            $scope.getCircles();
		    }, function (error) {
					  console.log(JSON.stringify(error));
		    });
		});
  }

	$scope.$on('$ionicView.enter', function(e) {
		$scope.getCircles();
	});
})
