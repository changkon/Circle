var myApp = angular.module('starter.controllers');

myApp.controller('EventPageCtrl', ['$scope', '$rootScope', '$stateParams', 'event', function($scope, $rootScope, $stateParams, event) {
    $scope.event = {};
    
    
    $scope.query = function() {
        event.getByIdPromise($stateParams.id)
            .then(function(result) {
                $scope.$apply(function() {
                    $scope.event = result[0];
                });
                console.log(result[0]);
            }, function(err) {
                console.log(err);
            });
    };
    
    $scope.$on('$ionicView.enter', function(e) {
        $scope.query();
    });
    
    $scope.delete = function() {
        console.log($scope.event.id);
        event.deletePromise($scope.event.id).then(function() {
            console.log("deleted");
        });
    };
}]);