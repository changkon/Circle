var myApp = angular.module('starter.controllers')

myApp.controller('FriendsCtrl', function($scope, $rootScope, $ionicPopover, $friend, $ionicPopup) {
	$scope.friends = [];
	$scope.hideFriends = true;
	$scope.hidePending = true;
	$scope.hideRequests = true;

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
    $friend.getAllFriends($scope);
  };

	$scope.$on('$ionicView.enter', function(e) {
		if ($friend.empty()) {
			$scope.query();
		} else {
			$scope.friends = $friend.currentFriends();
			$scope.requests = $friend.getFriendRequests();
			$scope.pendingFriends = $friend.getPendingFriends();

		}
	});

	$scope.toggleFriends = function() {
		$scope.hideFriends = !$scope.hideFriends;
	}

	$scope.togglePending = function() {
		$scope.hidePending = !$scope.hidePending;
	}

	$scope.toggleRequests = function() {
		$scope.hideRequests = !$scope.hideRequests;
	}

	$scope.acceptFriendRequest = function(friendId, friendName) {
		console.log(friendId);
		$ionicPopup.alert({
				title: 'Do you wish to add friend?',
				content: friendName
		}).then(function(res) {
				//call api to add friend
				var userId, friendUserId;
				if ($rootScope.userId < friendId) {
					userId = $rootScope.userId;
					friendUserId = friendId;
				} else {
					userId = friendId;
					friendUserId = $rootScope.userId;
				}
				$rootScope.client.invokeApi("ImportFriends/PostFriendByFriendIdAndUserId", {
		        method: 'POST',
		        body: { UserId: userId, FriendUserId: friendUserId }
		    }).done(function (response) {
		        console.log("successfully updated friendship")
		    }, function (error) {
		        console.log("error");
					  console.log(JSON.stringify(error));
		    });
		});
	}
})
