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
			$scope.friends = [];
			$rootScope.client.invokeApi("importfriends/GetAllFriends?userId=" + $rootScope.userId, { method: "GET" }).done(function(response) {
					validOnes = response.result.users;
					for (var i = 0; i < validOnes.length; i++) {
							var friend = validOnes[i];
							$scope.friends.push(friend);
					}
					 $scope.$apply();
					 $scope.$broadcast('scroll.refreshComplete');
			}, function (error) {
					console.log("fail querying importfriends/getallfriends: " + error);
			})
		};

	$scope.$on('$ionicView.enter', function(e) {
		$scope.query();
	});
})
