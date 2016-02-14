var myApp = angular.module('starter.controllers');

myApp.controller('EventTimeCtrl', ['$scope', 'event', function($scope, event) {
    // var date = new Date();
    // var d = date.getDate();
    // var m = date.getMonth();
    // var y = date.getFullYear();
    
    $scope.dates = event.dates;
    
    $scope.updateDate = function(date, time) {
        var hour = time.getHours();
        var min = time.getMinutes();
        var sec = time.getSeconds();
        date.hour(hour).minute(min).second(sec);
    };
    
    $scope.create = function() {
        if (event.type === event.EventType.PLANNED) {
            event.create(event).then(function(result) {
                event.showSuccessPopup();
            }, function(err) {
                event.showFailPopup();
            });
        } else {
            // suggest
            // todo
            console.log("Suggestion not completed yet");
        }
    };
}]);