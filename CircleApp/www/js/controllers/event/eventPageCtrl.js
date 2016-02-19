var myApp = angular.module('starter.controllers');

myApp.controller('EventPageCtrl', ['$scope', '$rootScope', '$stateParams', 'event', function($scope, $rootScope, $stateParams, event) {
    $scope.event = {};
    
    $scope.query = function() {
        event.getByIdPromise($stateParams.id)
            .then(function(result) {
                $scope.$apply(function() {
                    $scope.event = result[0];
                });
                return $scope.event;
            }).then(function(result) {
                var mobileService = $rootScope.client;
                var invitationsTable = mobileService.getTable('invitation');
                invitationsTable.where({
                    userId: $rootScope.userId,
                    eventId: result.id
                })
                .select('status')
                .read()
                .done(function(results) {
                    $scope.$apply(function() {
                        $scope.status = event.getEventStatusString(results[0].status);
                    });
                });
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