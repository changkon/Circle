var myApp = angular.module('starter.controllers');

myApp.controller('EventDateCtrl', ['$scope', 'event', function($scope, event) {
    $scope.selectMany = true;
    $scope.selected = [];
    
    $scope.update = function() {
        event.dates = $scope.selected.slice();
        console.log(event);
    };
}]);