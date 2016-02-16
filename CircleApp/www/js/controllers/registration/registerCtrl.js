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

myApp.controller('StartScreenCtrl', function($scope, $http, $rootScope, $location, $ionicLoading, $localstorage){
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
            $localstorage.set('currentToken',response.token);
            $rootScope.userId = response.id;
            $rootScope.userName= $scope.user.email;
						$rootScope.client = new WindowsAzure.MobileServiceClient('https://circleapp.azurewebsites.net').withFilter(function (request, next, callback) {
               request.headers['x-zumo-auth'] = response.token;
               next(request, callback);
            });
            //change this to go to home page
            $location.path('/tab/dash');
            //register device
            sendDeviceToken(response.id)
            findFriendRequests(response.id);
        })
        .error(function(data, status, headers, config) {
            // handle error things
            console.log("Error occurred - " + status);
            $ionicLoading.hide()
            // For local testing, you may need to change the ip value to your ip from ipconfig
            $rootScope.client = new WindowsAzure.MobileServiceClient('http://192.168.1.4:50770');
        })
    }

    /*
      This methods registers a device token with a userId
    */
    function sendDeviceToken(userId) {
      if (window.localStorage["device_token"] == "" || window.localStorage["device_token"] == undefined) {
        return;
      }
      var userDeviceTable = $rootScope.client.getTable('DeviceToken');
      userDeviceTable.insert({ userId: userId, DeviceToken: window.localStorage["device_token"] }).done(function(result) {
          console.log("successfully send device token");
      }, function (err) {
        console.log("error sending device token");
      });
    }

/*
    This method is called whenever a user logs in. It checks friend db for any existing friends request for this user as the receiver
    Eventually it should be changed to use push notifications rather than client request
*/
    function findFriendRequests(currentUserId) {
        friendsTable = $rootScope.client.getTable('friend');
        var query = friendsTable.where(function(userId) {
            return (this.userId == userId || this.friendUserId == userId) && this.status == 0 && this.actionUserId != userId;
        }, currentUserId);
        query.read().then(function(friendRequests) {
            for (i = 0; i < friendRequests.length; i++) {
                var friend = friendRequests[i];
                if (friend.userId == userId) {
                    alertFriendRequestById(friend.friendUserId, friendsTable, friend);
                } else {
                    alertFriendRequestById(friend.userId, friendsTable, friend);
                }
            }
        }, function (error) {
            console.log("failed to find friend requests" + error)
        });
    }

    /*
        This method will alert the user that they have a friend request from the person's name
        It converts the id returned by the find friend request into the friends name by calling the user table
        After confirming the friendship, this method updates the status of the friend relationship to 1 (accepted)
    */
    function alertFriendRequestById(id, friendsTable, friendRequest) {
        userTable = $rootScope.client.getTable('user');
        var query = userTable.where(function(id) { return this.id == id}, id);
        query.read().then(function(users) {
            console.log("alerting: " + id + " - " + users[0].name)
            $ionicPopup.alert({
                title: 'Do you wish to add friend?',
                content: users[0].name
            }).then(function(res) {
                friendRequest.status = 1;
                friendsTable.update(friendRequest).then(function (res) {
                    console.log('Succesfully confirmed friendship: ' + res)
                })
            });
        }, function (error) {
            console.log("couldn't find friends name for that id: " + error)
        });
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


myApp.controller('OptionalCtrl', function($scope, $http, $rootScope, $location,registrationService, $ionicLoading, $localstorage){
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
        $ionicLoading.hide()
        console.log(response.token);
        $localstorage.set('currentToken',response.token);
        $rootScope.userId = response.id;
        $rootScope.userName= $scope.newUser.email;
        $rootScope.client = new WindowsAzure.MobileServiceClient('https://circleapp.azurewebsites.net').withFilter(function (request, next, callback) {
           request.headers['x-zumo-auth'] = response.token;
           next(request, callback);
        });
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
