var myApp = angular.module('starter.controllers')

myApp.controller('CircleCreateCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.circle = {};

    $scope.create = function() {
		console.log("Creating circle with details:");
		console.log("Name - " + $scope.circle.name);

		// retrieve the mobile service instance
		var mobileService = $rootScope.client;
		var circlesTable = mobileService.getTable('circle');

		circlesTable.insert({
			Name: $scope.circle.name,
		}).done(function(result) {
			console.log("success");
		}, function (err) {
			console.log("error");
			console.log(err);
		});

	};
}]);
