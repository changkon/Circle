var myApp = angular.module('starter.controllers');

myApp.controller('EventDetailCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.event = {};

    $scope.create = function() {
		console.log("Creating event with details:");
		console.log("Title - " + $scope.event.title);
		console.log("Description - " + $scope.event.description);
		console.log("Date - " + $scope.event.date);
		console.log("Location - " + $scope.event.location);

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