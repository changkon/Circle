angular.module('starter.controllers', ['ionic', 'ngCordova', 'ui.calendar'])

.controller('NavCtrl', ['$scope', 'circle', function($scope, circle) {
	$scope.circle = {
		title: circle.title
	};
}])

.controller('DashCtrl', function($scope, $http, $rootScope) {
   $scope.data = {};
   $scope.user = {};
   $scope.showRegister = false;
   $scope.showLogin = true;

    $scope.login = function() {
        console.log("LOGIN user: " + $scope.data.username + " - PW: " + $scope.data.password);
        $http({
            method: 'POST',
            url: "http://192.168.1.69:50770/api/auth",
            data: {username: $scope.data.username, password: $scope.data.password},
            headers: {'Content-Type': 'application/json'}
        })
        .success(function(response) {
            // handle success things
            console.log(response.token);
            $rootScope.userId = response.id;
            $rootScope.userName= $scope.data.username;
						$rootScope.client = new WindowsAzure.MobileServiceClient('http://192.168.1.69:50770').withFilter(function (request, next, callback) {
               request.headers['x-zumo-auth'] = response.token;
               next(request, callback);
            });
            findFriendRequests(response.id);
        })
        .error(function(data, status, headers, config) {
            // handle error things
            console.log("Error occurred - " + status);
            // For local testing, you may need to change the ip value to your ip from ipconfig
            $rootScope.client = new WindowsAzure.MobileServiceClient('http://192.168.1.4:50770');
        })
    }

/*
    This method is called whenever a user logs in. It checks friend db for any existing friends request for this user as the receiver
    Eventually it should be changed to use push notifications rather than client request
*/
    function findFriendRequests(userId) {
        friendsTable = $rootScope.client.getTable('friend');
        var query = friendsTable.where(function(userId) {
            return (this.userId == userId || this.friendUserId == userId) && this.status == 0 && this.actionUserId != userId;
        }, userId);
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

    $scope.toggleRegister = function() {
        $scope.showRegister = !$scope.showRegister;
        $scope.showLogin = !$scope.showLogin;
    }

    $scope.register = function() {
        console.log("REGSITER user: " + $scope.user.email + " - PW: " + $scope.user.password +
        " PHONE NUMBER " + $scope.user.phoneNumber);
        $http({
            method: 'POST',
            url: "http://192.168.1.69:50770/tables/User",
            data: {email: $scope.user.email, phoneNumber: $scope.user.phoneNumber.replace("+",""),
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
  $scope.$on('$ionicView.enter', function(e) {
     try {
       var client = $rootScope.client;
        todoItemTable = client.getTable('todoitem');
        var query = todoItemTable.where({ complete: false });
        query.read().then(function(todoItems) {
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
