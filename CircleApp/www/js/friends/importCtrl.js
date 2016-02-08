var myApp = angular.module('starter.controllers')

myApp.controller('ImportCtrl', function($scope, $rootScope, $cordovaContacts, $ionicPopup) {
    $scope.contacts = [];

    //we want to load up all contacts when view is loaded
    $scope.$on('$ionicView.loaded', function(e) {
        $cordovaContacts.find({filter: ''}).then(function(contacts) {
            //console.log(contacts)
            var phoneNumbers = [];
            for (var i = 0; contacts != null && i < contacts.length; i++) {
                var contactNumbers = contacts[i].phoneNumbers; //deal with people that have multiple phonenumbers
                for (var j = 0; contactNumbers != undefined && j < contactNumbers.length; j++) {
                    phoneNumbers.push(contactNumbers[j].value);
                    console.log("Contact: " + contacts[i].displayName + " has number: " + contactNumbers[j].value);
                }
            }
            uniqueNumbers = phoneNumbers.filter(function(item, pos) { return phoneNumbers.indexOf(item) == pos; })
            //console.log(uniqueNumbers.length);
            for (var i = 0; i < uniqueNumbers.length; i+=100) {
                var uniqueNumbersSection = uniqueNumbers.splice(i, i+100);
                var phoneNumbersString = "";
                for (var i = 0; i < uniqueNumbersSection.length; i++) {
                    phoneNumbersString += uniqueNumbersSection[i].replace("+","") + ",";
                }
                $rootScope.client.invokeApi("importfriends/GetValidUsersByPhoneNumber?phonenumbers="
                     + phoneNumbersString, { method: "GET" }).done(function(response) {
                    validOnes = response.result.friends;
                    for (var i = 0; i < validOnes.length; i++) {
                        console.log(validOnes[i].phoneNumber + " number was found! " + validOnes[i].name);
                        var contact = validOnes[i];
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
})
