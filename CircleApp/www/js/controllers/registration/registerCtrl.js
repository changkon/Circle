var myApp = angular.module('starter.controllers')

myApp.service('registrationService', function() {
  var newUser = {
    email : '',
    phoneNumber : '',
    password: '',
    name: '',
    age: '',
    gender: ''

  };
  return newUser;
});

myApp.controller('StartScreenCtrl', function($scope, $http, $rootScope, $location, $ionicLoading){
    $scope.user = {};

    $scope.startRegistration = function() {
        $location.path('/registration_require');
    }

    $scope.login = function() {
        console.log("LOGIN user: " + $scope.user.email + " - PW: " + $scope.user.password);
        $ionicLoading.show({
          template: 'loading'
        })
        $http({
            method: 'POST',
            url: "https://circleapp.azurewebsites.net/api/auth",
            data: {username: $scope.user.email, password: $scope.user.password},
            headers: {'Content-Type': 'application/json'}
        })
        .success(function(response) {
            // handle success things
            $ionicLoading.hide()
            console.log(response.token);
            $rootScope.userId = response.id;
            $rootScope.userName= $scope.user.email;
						$rootScope.client = new WindowsAzure.MobileServiceClient('https://circleapp.azurewebsites.net').withFilter(function (request, next, callback) {
               request.headers['x-zumo-auth'] = response.token;
               next(request, callback);
            });
            //change this to go to home page
            $location.path('/tab/dash');
        })
        .error(function(data, status, headers, config) {
            // handle error things
            console.log("Error occurred - " + status);
            $ionicLoading.hide()
            // For local testing, you may need to change the ip value to your ip from ipconfig
            $rootScope.client = new WindowsAzure.MobileServiceClient('http://192.168.1.4:50770');
        })


    }
})

myApp.controller('RequireCtrl', function($scope, $http, $rootScope, $location, registrationService){
    $scope.newUser = registrationService;
    $scope.goPassword= function() {
        console.log($scope.userForm.$valid);
        if ($scope.userForm.$valid) {
          $location.path('/registration_password');
        }

    }
})

myApp.controller('PasswordCtrl', function($scope, $http, $rootScope, $location, registrationService){
    $scope.newUser = registrationService;
    $scope.temp = {};

    $scope.goOptional= function() {
        console.log($scope.userForm.$valid);
        if ($scope.userForm.$valid) {
          $location.path('/registration_optional');
        }
    }
})


myApp.controller('OptionalCtrl', function($scope, $http, $rootScope, $location,registrationService, $ionicLoading){
    $scope.newUser = registrationService;
    $scope.goImportFriend = function() {
      console.log("REGSITER user: " + $scope.newUser.email + " - PW: " + $scope.newUser.password +
      " PHONE NUMBER " + $scope.newUser.phoneNumber);
      $ionicLoading.show({
        template: 'loading'
      })
      $http({
          method: 'POST',
          url: "https://circleapp.azurewebsites.net/tables/User",
          data: {email: $scope.newUser.email, phoneNumber: $scope.newUser.phoneNumber.replace("+",""),
          password: $scope.newUser.password, gender: $scope.newUser.gender,
          name: $scope.newUser.name, age: $scope.newUser.age},
          headers: {'Content-Type': 'application/json'}
      })
      .success(function(response) {
          // handle success things
          $ionicLoading.hide();
          console.log(response.token);
          //change this to go to home page
          $location.path('/tab/dash');
      })
      .error(function(data, status, headers, config) {
          // handle error things
          $ionicLoading.hide();
          console.log("Error occurred - " + status);
      })
    }

    $scope.register = function() {

    }
})
