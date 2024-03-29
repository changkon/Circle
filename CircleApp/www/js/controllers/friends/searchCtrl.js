var myApp = angular.module('starter.controllers')

myApp.controller('SearchCtrl', function($scope, $rootScope, $ionicPopup, $friend) {
    $scope.friend = {};
    $scope.friends = [];

    $scope.search = function() {
        console.log("search");
        $scope.friends = [];
        $rootScope.client.invokeApi("importfriends/GetFriendsByName?name=" + $scope.friend.name, { method: "GET" }).done(function(response) {
          validOnes = response.result.users.filter(function(f) {
            //only get the ones that aren't already friends
            var friends = $friend.allFriends();
            for (var i = 0; i < friends.length; i++) {
              var friend = friends[i];
              if (friend.id == f.id) { return false }
            }
            return true;
          });
            for (var i = 0; i < validOnes.length; i++) {
                console.log(validOnes[i].phoneNumber + " number was found! " + validOnes[i].name);
                var friend = validOnes[i];
                friend.checked = false;
                $scope.friends.push(friend);
            }
             $scope.$apply();
        }, function (error) {
            console.log("fail querying user db: " + error);
        });
    }

    $scope.toggle = function(friend) {
        friend.checked = !friend.checked;
    }

    /*
    This method is called when the add button on the search page is pressed
    it will loop through the selected friends and send a request to insert a friend entry into table
    in future, once we get a list of user's friends, we can filter the contacts to only show ones that aren't already friends
    */
    $scope.addFriends = function() {
        console.log("adding")
        var selected = $scope.friends.filter(function(friend) {
            return friend.checked;
        })
        for (var i = 0; i < selected.length; i++) {
            var userIdToAdd, friendUserIdToAdd;
            if ($rootScope.userId < selected[i].id) {
                userIdToAdd = $rootScope.userId;
                friendUserIdToAdd = selected[i].id;
            } else {
                userIdToAdd = selected[i].id;
                friendUserIdToAdd = $rootScope.userId;
            }
            var friendsTable = $rootScope.client.getTable('friend');
            friendsTable.insert({ userId: userIdToAdd, friendUserid: friendUserIdToAdd, status: 0, actionUserId: $rootScope.userId }).done(function(result) {
                console.log("success");
                if (result.actionUserId == result.userId) {
                  $scope.sendPushNotification(result.friendUserId, result.id);
                } else {
                  $scope.sendPushNotification(result.userId, result.id);
                }
            }, function (err) {
               $ionicPopup.alert({
                    title: 'Error',
                    content: "Friend may already be added"
                })
            });
        }
        if (selected.length > 0) {
            $ionicPopup.alert({
                title: 'Friend Request Sent',
                content: "Added " + selected.length + " friends"
            })
        }
    }

    $scope.sendPushNotification = function(friendId, friendTableId) {
      $rootScope.client.invokeApi("importfriends/GetSendPushNotification?id=" + $rootScope.userId + "&friendId=" + friendId + "&friendTableId=" + friendTableId, { method: "GET" }).done(function(response) {
        console.log("sent push notification request");
      }, function (error) {
        console.log("failed sending push notification: " + error);
      });
    }
})
