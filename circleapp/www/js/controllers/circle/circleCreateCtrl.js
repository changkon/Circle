var myApp = angular.module('starter.controllers')

myApp.controller('CircleCreateCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.circle = {};

    $scope.create = function() {
		console.log("Creating circle with details:");
		console.log("Name - " + $scope.circle.name);

		// retrieve the mobile service instance
		var mobileService = $rootScope.client;

    mobileService.invokeApi('CircleCustom/PostCircle', {
        method: 'POST',
        body: { Name: $scope.circle.name, UserId: $rootScope.userId }
    }).done(function (response) {
        console.log("successfully created circle")
    }, function (error) {
        console.log("error");
			  console.log(error);
    });

		// var circlesTable = mobileService.getTable('circle');
    //
		// circlesTable.insert({
		// 	Name: $scope.circle.name,
		// }).done(function(result) {
		// 	console.log("success");
		// }, function (err) {
		// 	console.log("error");
		// 	console.log(err);
		// });

	};
}]);
