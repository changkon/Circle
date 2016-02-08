var myApp = angular.module('starter.controllers')

myApp.controller('InviteCtrl', function($scope, $rootScope, $cordovaContacts, $ionicPopup, $cordovaSms) {
    $scope.contacts = [];
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
                    $scope.contacts = missingContacts;
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

    $scope.inviteFriends = function() {
        var selected = $scope.contacts.filter(function(contact) {
            return contact.checked;
        });
        for (var i = 0; i < selected.length; i++) {
            var num = selected[i].phoneNumbers[0].value;
            console.log('Sending invitation to ' + num)
            // Uncomment the lines below to actually send the SMS

            // $cordovaSms.send(num, $rootScope.userName + ' has invited you to use Circle!', options)
            //     .then(function() {
            //         console.log('Success');
            //     }, function(error) {
            //         console.log('Error');
            //     });
        }
    }

})
