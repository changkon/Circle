var myApp = angular.module('starter.controllers')

myApp.controller('ImportCtrl', function($scope, $rootScope, $cordovaContacts, $ionicPopup, $friend) {
    $scope.contacts = [];

    //we want to load up all contacts when view is loaded
    $scope.$on('$ionicView.enter', function(e) {
        $scope.contacts = [];
        $cordovaContacts.find({filter: ''}).then(function(contacts) {
            //console.log(contacts)
            var phoneNumbers = [];
            for (var i = 0; contacts != null && i < contacts.length; i++) {
                var contactNumbers = contacts[i].phoneNumbers; //deal with people that have multiple phonenumbers
                for (var j = 0; contactNumbers != undefined && j < contactNumbers.length; j++) {
                    phoneNumbers.push(contactNumbers[j].value);
          //          console.log("Contact: " + contacts[i].displayName + " has number: " + contactNumbers[j].value);
                }
            }
            uniqueNumbers = phoneNumbers.filter(function(item, pos) { return phoneNumbers.indexOf(item) == pos; })
            //console.log(uniqueNumbers.length);
            for (var i = 0; i < uniqueNumbers.length; i+=100) {
                var uniqueNumbersSection = uniqueNumbers.splice(i, i+100);
                var phoneNumbersString = "";
                for (var j = 0; j < uniqueNumbersSection.length; j++) {
                    phoneNumbersString += uniqueNumbersSection[j].replace("+","").replace(/ /g, '+') + ",";
                }
                $rootScope.client.invokeApi("importfriends/GetValidUsersByPhoneNumber?phonenumbers="
                     + phoneNumbersString, { method: "GET" }).done(function(response) {
                    validOnes = response.result.friends.filter(function(f) {
                      //only get the ones that aren't already friends
                      var friends = $friend.allFriends();
                      for (var j = 0; j < friends.length; j++) {
                        var friend = friends[j];
                      //  console.log("friiend id is " + friend.id + " and f id is " + f.id + " - " + f.name);
                        if (friend.id == f.id) { return false }
                      }
                      return true;
                    });
                    for (var j = 0; j < validOnes.length; j++) {
                        console.log(validOnes[j].phoneNumber + " number was found! " + validOnes[j].name);
                        var contact = validOnes[j];
                        contact.checked = false;
                        $scope.contacts.push(contact);
                    }
                     $scope.$apply();
                }, function (error) {
                    console.log("fail querying user db: " + error);
                });
            }
        }, function (error) {
            console.log("Error importing contacts: " + error);
        });
    });

    $scope.toggle = function(contact) {
        contact.checked = !contact.checked;
    }

/*
    This method is called when the add button on the import page is pressed
    it will loop through the selected friends and send a request to insert a friend entry into table
    in future, once we get a list of user's friends, we can filter the contacts to only show ones that aren't already friends
*/
    $scope.addFriends = function() {
        var selected = $scope.contacts.filter(function(contact) {
            return contact.checked;
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
                if ($rootScope.userId != result.friendUserId) {
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
        console.log("successfully sent push notification request");
      }, function (error) {
        console.log("failed sending push notification: " + error);
      });
    }
})
