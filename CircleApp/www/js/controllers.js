angular.module('starter.controllers', [])


.controller('DashCtrl', function($scope, $http, $rootScope) {
   $scope.data = {};
   $scope.user = {};
   $scope.showRegister = false;
   $scope.showLogin = true;
 
    $scope.login = function() {
        console.log("LOGIN user: " + $scope.data.username + " - PW: " + $scope.data.password);
        $http({
            method: 'POST',
            url: "https://circleapp.azurewebsites.net/api/auth",
            data: {username: $scope.data.username, password: $scope.data.password},
            headers: {'Content-Type': 'application/json'}
        })
        .success(function(response) {
            // handle success things
            console.log(response.token);
            $rootScope.token = response.token;
        })
        .error(function(data, status, headers, config) {
            // handle error things
            console.log("Error occurred - " + status);
        })
    }
    
    $scope.toggleRegister = function() {
        $scope.showRegister = !$scope.showRegister;
        $scope.showLogin = !$scope.showLogin;
    }
    
    
    $scope.register = function() {
        console.log("REGSITER user: " + $scope.user.email + " - PW: " + $scope.user.password + 
        " PHONE NUMBER " + $scope.user.phoneNumber);
        $http({
            method: 'POST',
            url: "https://circleapp.azurewebsites.net/tables/User",
            data: {email: $scope.user.email, phoneNumber: $scope.user.phoneNumber, 
            password: $scope.user.password, gender: $scope.user.gender,
            name: $scope.user.name, age: $scope.user.age},
            headers: {'Content-Type': 'application/json'}
        })
        .success(function(response) {
            // handle success things
            console.log(response.token);
        })
        .error(function(data, status, headers, config) {
            // handle error things
            console.log("Error occurred - " + status);
        })
        
    }
    
    
})

.controller('ChatsCtrl', function($scope, Chats, $rootScope) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  $scope.$on('$ionicView.enter', function(e) {
     //Chats.get(0).name = $rootScope.token + " - token"
     try {
       var client = new WindowsAzure.MobileServiceClient('https://circleapp.azurewebsites.net').withFilter(function (request, next, callback) {
               request.headers['x-zumo-auth'] = $rootScope.token;
               next(request, callback);
            });
        todoItemTable = client.getTable('todoitem');
        var query = todoItemTable.where({ complete: false });
        query.read().then(function(todoItems) {
          //console.log(todoItems.length + " - " + Chats.all().length)
          for (i = 0; i < todoItems.length && i < Chats.all().length; i++) {
            Chats.get(i).name = todoItems[i].id;
            Chats.get(i).lastText = todoItems[i].text;
          }
        }, function (error) {
            Chats.get(0).lastText = "fail-" + error
        });
     } catch (err) {
        Chats.get(0).lastText = "fail"
     }

  });

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
