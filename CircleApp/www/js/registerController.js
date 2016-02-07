var myApp = angular.module('starter.controllers')

myApp.controller('StartScreenCtrl', function($scope, $http, $rootScope, $location){

    $scope.startRegistration = function() {
        $location.path('/registration_require');
    }
})

myApp.controller('RequireCtrl', function($scope, $http, $rootScope, $location){

    $scope.goPassword= function() {
        $location.path('/registration_password');
    }
})

myApp.controller('PasswordCtrl', function($scope, $http, $rootScope, $location){

    $scope.goOptional= function() {
        $location.path('/registration_optional');
    }
})


myApp.controller('OptionalCtrl', function($scope, $http, $rootScope, $location){
    $scope.goImportFriend = function() {
        $location.path('/tab/dash');
    }
})
