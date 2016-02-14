var myApp = angular.module('starter.controllers');

myApp.controller('EventDateCtrl', ['$scope', 'event', function($scope, event) {
    $scope.selectMany = false;
    $scope.selected = [];
    
    $scope.update = function() {
        console.log($scope.selected);
        $scope.selected.forEach(function(currentValue, index, array) {
            event.dates.push({
                startDate: currentValue,
                endDate: currentValue
            });
        });
        
        // set event type
        event.type = event.EventType.PLANNED;
        console.log(event);
    };
}]);