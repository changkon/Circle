var myApp = angular.module('starter.controllers');

myApp.controller('EventDateCtrl', ['$scope', 'event', function($scope, event) {
    $scope.selectMany = false;
    $scope.selected = [];
    
    $scope.update = function() {
        $scope.selected.forEach(function(currentValue, index, array) {
            event.dates.push({
                startDate: currentValue.clone(),
                endDate: currentValue.clone()
            });
        });
        
        // set event type
        event.type = event.EventType.PLANNED;
        console.log(event);
    };
}]);