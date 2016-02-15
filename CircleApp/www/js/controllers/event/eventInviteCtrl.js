var myApp = angular.module('starter.controllers');

myApp.controller('EventInviteCtrl', ['$scope', '$rootScope', '$cordovaContacts', 'event', function($scope, $rootScope, $cordovaContacts, event) {
    $scope.unregistered = [];
    $scope.registered = [];
    var options = {
        replaceLineBreaks: false,
        android: {
          intent: ''
        }
      };

    $scope.$on('$ionicView.loaded', function(e) {
        $cordovaContacts.find({filter: ''}).then(function(contacts) {
            var phoneNumbers = [];
            for (var i = 0; contacts != null && i < contacts.length; i++) {
                var contactNumbers = contacts[i].phoneNumbers; //deal with people that have multiple phonenumbers
                for (var j = 0; contactNumbers != undefined && j < contactNumbers.length; j++) {
                    phoneNumbers.push(contactNumbers[j].value);
                    console.log("Contact: " + contacts[i].displayName + " has number: " + contactNumbers[j].value);
                }
            }
            uniqueNumbers = phoneNumbers.filter(function(item, pos) { return phoneNumbers.indexOf(item) == pos; })
            for (var i = 0; i < uniqueNumbers.length; i+=100) {
                var uniqueNumbersSection = uniqueNumbers.splice(i, i+100);
                var phoneNumbersString = "";
                for (var i = 0; i < uniqueNumbersSection.length; i++) {
                    phoneNumbersString += uniqueNumbersSection[i].replace("+","") + ",";
                }
                
                $rootScope.client.invokeApi("importfriends/GetNonUsersByPhoneNumber?phonenumbers="
                     + phoneNumbersString, { method: "GET" }).done(function(response) {
                    var missingNumbers = response.result.missingNumbers;
                    var missingContacts = contacts.filter(function(contact) {
                        if (contact.phoneNumbers == null) { return false; }
                        var num = contact.phoneNumbers[0].value.replace("+","")
                        return missingNumbers.indexOf(num) >= 0;
                    });
                    $scope.unregistered = missingContacts;
                    console.log(missingContacts);
                    $scope.$apply();
                }, function (error) {
                    console.log("fail querying user db: " + error);
                });
                
                $rootScope.client.invokeApi("importfriends/GetValidUsersByPhoneNumber?phonenumbers="
                     + phoneNumbersString, { method: "GET" }).done(function(response) {
                         console.log(response);
                    validOnes = response.result.friends;
                    for (var i = 0; i < validOnes.length; i++) {
                        console.log(validOnes[i].phoneNumber + " number was found! " + validOnes[i].name);
                        var contact = validOnes[i];
                        contact.checked = false;
                        $scope.registered.push(contact);
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
    
    $scope.update = function() {
        // temporary
        console.log(event);
    };
    
    $scope.toggleUnregistered = function(contact) {
        console.log(contact);
        if (contact.checked === true) {
            event.invitees.unregistered.push(contact);
        } else {
            // delete
            var index = event.invitees.unregistered.indexOf(contact);
            event.invitees.unregistered.splice(index, 1);
        }
        console.log(event);
    };
}])