var myApp = angular.module('starter.controllers');

myApp.controller('EventDateCtrl', ['$scope', 'event', function($scope, event) {
    $scope.selectMany = false;
    $scope.selected = [];
    
    $scope.update = function() {
        event.startDate = $scope.selected.slice();
        event.endDate = $scope.selected.slice();
        console.log(event);
    };
}]);