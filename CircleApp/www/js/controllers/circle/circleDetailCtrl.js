var myApp = angular.module('starter.controllers');

myApp.controller('CircleDetailCtrl', function($scope, $rootScope, $stateParams, $ionicPopover, $friend) {
    var circleId = $stateParams.circleId;
    console.log("circle id is " + circleId);
    $scope.circle = {Name: "testcircle"};
    $scope.friends = $friend.currentFriends();
    for (var i = 0; i < $scope.friends; i++) {
      $scope.friends[i].checked = false;
    }

    $scope.$on('$ionicView.enter', function(e) {
  		$scope.query();
  	});

    $scope.query = function() {
      var mobileService = $rootScope.client;
      mobileService.invokeApi('CircleCustom/GetAllUsersInACircles?circleId=' + circleId, { method: 'GET' }).done(function (response) {
          $scope.circleMembers = response.result
          $scope.$apply();
          console.log("successfully queried circle: " + $scope.circleMembers);
      }, function (error) {
          console.log("error");
          console.log(error);
      });
    }

    $ionicPopover.fromTemplateUrl('templates/plus-button-circleDetails-popover.html', {
  		scope: $scope
  	}).then(function(popover) {
  		$scope.popover = popover;
  		console.log(popover);
  	});

    $ionicPopover.fromTemplateUrl('templates/friends/invite-friends-popover.html', {
      scope: $scope
    }).then(function(popover) {
      $scope.popoverInvite = popover;
      console.log(popover);
    });

  	// plus button click
  	$scope.plusActivate = function($event) {
  		$scope.popover.show($event);
  	};

    $scope.closePopover = function() {
        $scope.popover.hide();
    };

    $scope.invitePopover = function($event) {
      //open another popover which is to choose what friends to select
        $scope.popoverInvite.show($event);
        $scope.popover.hide();
    };

    $scope.inviteClose = function() {
        var selected = $scope.friends.filter(function(friend) {
            return friend.checked;
        })
        for (var i = 0; i < selected.length; i++) {
          console.log("friend: " + selected[i].name + " will be invited");
          var mobileService = $rootScope.client;
          mobileService.invokeApi('CircleCustom/PostInviteToCircle', {
  		        method: 'POST',
  		        body: { FriendId: selected[i].id, CircleId: $stateParams.circleId }
  		    }).done(function (response) {
  		        console.log("successfully invited to circle!")
  		    }, function (error) {
              console.log(JSON.stringify(error));
          });
        }
        $scope.query();
        $scope.popoverInvite.hide();
    };

    $scope.toggle = function(friend) {
        friend.checked = !friend.checked;
    }

  	//Cleanup the popover when we're done with it!
  	$scope.$on('$destroy', function() {
  		$scope.popover.remove();
  	});

	});
