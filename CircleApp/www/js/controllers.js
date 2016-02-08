angular.module('starter.controllers', ['ionic', 'ngCordova'])

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

.controller('ImportCtrl', function($scope, $rootScope, $cordovaContacts, $ionicPopup) {
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

/*
    This controller is for inviting friends to use Circle by sending them a text
*/
.controller('InviteCtrl', function($scope, $rootScope, $cordovaContacts, $ionicPopup, $cordovaSms) {
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

/*
    This controller is used for Searching for friends and adding them
*/
.controller('SearchCtrl', function($scope, $rootScope, $ionicPopup) {
    $scope.friend = {};
    $scope.friends = [];
    $scope.search = function() {
        console.log("search");
        $rootScope.client.invokeApi("importfriends/GetFriendsByName?name=" + $scope.friend.name, { method: "GET" }).done(function(response) {
            validOnes = response.result.users;
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
})

.controller('FriendsCtrl', function($scope, $rootScope, $ionicPopover) {
	$scope.friends = [];

	$ionicPopover.fromTemplateUrl('templates/plus-button-friends-popover.html', {
		scope: $scope
	}).then(function(popover) {
		$scope.popover = popover;
		console.log(popover);
	});

	// plus button click
	$scope.plusActivate = function($event) {
		$scope.popover.show($event);
	};

    $scope.closePopover = function() {
        $scope.popover.hide();
    };

	//Cleanup the popover when we're done with it!
	$scope.$on('$destroy', function() {
		$scope.popover.remove();
	});

	$scope.query = function() {
		var mobileService = $rootScope.client;
		var eventsTable = mobileService.getTable('friends');
		eventsTable.read().done(function(results) {
			$scope.$apply(function() {
				$scope.friends = results;
			});
			$scope.$broadcast('scroll.refreshComplete');
		}, function(err) {
			console.log("Error: " + err);
		});
	};

	$scope.$on('$ionicView.enter', function(e) {
		$scope.query();
	});
})

.controller('EventCtrl', function($scope, $rootScope, $ionicPopover) {
	$scope.hosting = [];
    $scope.attending = [];

    $ionicPopover.fromTemplateUrl('templates/plus-button-event-popover.html', {
		scope: $scope
	}).then(function(popover) {
		$scope.popover = popover;
	});

	// plus button click
	$scope.plusActivate = function($event) {
		$scope.popover.show($event);
	};

    $scope.closePopover = function() {
        $scope.popover.hide();
    };

	//Cleanup the popover when we're done with it!
	$scope.$on('$destroy', function() {
		$scope.popover.remove();
	});

    var hostedEvents = function() {
        $rootScope.client.invokeApi("userevents/GetAllUserHostedEvents/" + $rootScope.userId, {
            method: "GET"
        }).done(function(results) {
            $scope.$apply(function() {
                $scope.hosting = results.result;
            });
            $scope.$broadcast('scroll.refreshComplete');
            
        }, function(err) {
            console.log("Error retrieving events: " + err);
        });
    };
    
    var attendingEvents = function() {
        $rootScope.client.invokeApi("userevents/GetAllUserAttendingEvents/" + $rootScope.userId, {
            method: "GET"
        }).done(function(results) {
            $scope.$apply(function() {
                $scope.attending = results.result;
            });
            $scope.$broadcast('scroll.refreshComplete');
            
        }, function(err) {
            console.log("Error retrieving events: " + err);
        });
    };

	$scope.query = function() {
        hostedEvents();
        attendingEvents();
	};

	$scope.$on('$ionicView.enter', function(e) {
		$scope.query();
	});
})

.controller('EventDetailCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.event = {};

    $scope.create = function() {
		console.log("Creating event with details:");
		console.log("Title - " + $scope.event.title);
		console.log("Description - " + $scope.event.description);
		console.log("Date - " + $scope.event.date);
		console.log("Location - " + $scope.event.location);

		// retrieve the mobile service instance
		// var mobileService = $rootScope.client;
		// var eventsTable = mobileService.getTable('event');

		// eventsTable.insert({
		// 	title: $scope.event.title,
		// 	description: $scope.event.description,
		// 	date: $scope.event.date,
		// 	location: $scope.event.location
		// }).done(function(result) {
		// 	console.log("success");
		// }, function (err) {
		// 	console.log("error");
		// 	console.log(err);
		// });
	};
}])

.controller('EventInviteCtrl', ['$scope', '$rootScope', '$cordovaContacts', function($scope, $rootScope, $cordovaContacts) {
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
}])

.controller('EventDateCtrl', ['$scope', '$cordovaCalendar', function($scope, $cordovaCalendar) {
    var options = {
        date: new Date(),
        mode: 'date', // or 'time'
        minDate: new Date() - 10000,
        allowOldDates: true,
        allowFutureDates: false,
        doneButtonLabel: 'DONE',
        doneButtonColor: '#F2F3F4',
        cancelButtonLabel: 'CANCEL',
        cancelButtonColor: '#000000'
    };

    document.addEventListener("deviceready", function () {

        $cordovaDatePicker.show(options).then(function(date){
            alert(date);
        });

    }, false);
}]);
