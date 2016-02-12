var myApp = angular.module('starter.controllers');

myApp.controller('EventDetailCtrl', ['$scope', '$rootScope', 'event', function($scope, $rootScope, event) {
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
        
        console.log(event);

		// retrieve the mobile service instance
		// var mobileService = $rootScope.client;
		// var eventsTable = mobileService.getTable('event');

		// eventsTable.insert({
		// 	title: $scope.event.title,
		// 	description: $scope.event.description,
		// 	date: $scope.event.date,
		// 	location: $scope.event.location
		// }).done(function(result) {
		// 	console.log("success");
		// }, function (err) {
		// 	console.log("error");
		// 	console.log(err);
		// });
	};
}]);