var myApp = angular.module('starter.controllers')

myApp.controller('EventCtrl', function($scope, $rootScope, $ionicPopover) {
	$scope.hosting = [];
    $scope.attending = [];

    $ionicPopover.fromTemplateUrl('templates/plus-button-event-popover.html', {
		scope: $scope
	}).then(function(popover) {
		$scope.popover = popover;
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

    var hostedEvents = function() {
        $rootScope.client.invokeApi("userevents/GetAllUserHostedEvents/" + $rootScope.userId, {
            method: "GET"
        }).done(function(results) {
            $scope.$apply(function() {
                $scope.hosting = results.result;
            });
            $scope.$broadcast('scroll.refreshComplete');
            
        }, function(err) {
            console.log("Error retrieving events: " + err);
        });
    };
    
    var attendingEvents = function() {
        $rootScope.client.invokeApi("userevents/GetAllUserAttendingEvents/" + $rootScope.userId, {
            method: "GET"
        }).done(function(results) {
            $scope.$apply(function() {
                $scope.attending = results.result;
            });
            $scope.$broadcast('scroll.refreshComplete');
            
        }, function(err) {
            console.log("Error retrieving events: " + err);
        });
    };

	$scope.query = function() {
        hostedEvents();
        attendingEvents();
	};

	$scope.$on('$ionicView.enter', function(e) {
		$scope.query();
	});
})
