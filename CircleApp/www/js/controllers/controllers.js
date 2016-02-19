angular.module('starter.controllers', ['ionic', 'ngCordova'])

.controller('NavCtrl', function($scope, circle, $location) {
	$scope.circle = {
		title: circle.title
	};

	$scope.goSetting = function () {
		$location.path("/setting");
	}
})
