var myApp = angular.module('starter.controllers');

myApp.controller('EventDetailCtrl', ['$scope', '$rootScope', 'event', '$stateParams', function($scope, $rootScope, event, $stateParams) {
    $scope.event = {};

    $scope.update = function() {
		console.log("Creating event with details:");
		console.log("Title - " + $scope.event.title);
		console.log("Description - " + $scope.event.description);
		console.log("Location - " + $scope.event.location);

        // set event details
        event.title = $scope.event.title;
        event.description = $scope.event.description;
        event.location = $scope.event.location;
	};
    
    // http://stackoverflow.com/questions/16635381/angular-ui-router-get-previous-state
    $rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
        if (from.url == "/event") {
            $scope.event = {};
            event.reset();
        }
    });
}]);