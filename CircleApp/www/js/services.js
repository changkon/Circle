angular.module('starter.services', ['ngCordova'])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?!',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})
.service('circle', function() {
	// sharable settings object
	this.title = "Circle";
})
.service('event', ['$rootScope', '$cordovaSms', '$ionicPopup', function($rootScope, $cordovaSms, $ionicPopup) {
    // Create enum.
    var EventStatus = Object.freeze({
        HOST: 0,
        ATTENDING: 1,
        NOTGOING: 2,
        PENDING: 3
    });

    this.EventType = Object.freeze({
        PLANNED: "Planned",
        SUGGESTION: "Suggestion"
    });

    // retrieve the mobile service instance
    var mobileService = $rootScope.client;
    var eventsTable = mobileService.getTable('event');
    var invitationsTable = mobileService.getTable('invitation');

    // creates event and inserts into eventtable. returns a promise
    var eventPromise = function(event) {
        return eventsTable.insert({
			title: event.title,
			description: event.description,
			startDate: event.dates[0].startDate,
            endDate: event.dates[0].endDate,
			location: event.location
		});

        // .done(function(result) {
		// 	console.log("Succesfully created event");
        //     return result;
		// }, function (err) {
		// 	console.log("Error creating event");
		// 	console.log(err);
		// });
    };

    var suggestEventPromise = function(event) {
        return eventsTable.insert({
			title: event.title,
			description: event.description,
			startDate: (function() { return; })(), // undefined
            endDate: (function() { return; })(), // undefined
			location: event.location
		});

        // .done(function(result) {
		// 	console.log("Succesfully suggested event");
		// }, function (err) {
		// 	console.log("Error creating event");
		// 	console.log(err);
		// });
    };

    // updates invitations table
    var updateInvitations = function(user, event, registeredInvitees) {
        // set userId to be HOST of event
        invitationsTable.insert({
            userId: user,
            eventId: event,
            status: EventStatus.HOST
        }).done(function(result) {
            console.log("Successfully set user as host");
        }, function(err) {
            console.log("Error setting user as host invitations");
        });

        // // set registered users as pending
        // registeredInvitees.forEach(function(currentValue, index, array) {
        //     invitationsTable.insert({
        //         userId: 1,//currentValue friend Id
        //         eventId: this.eventId,
        //         status: EventStatus.PENDING
        //     }).done(function(result) {
        //         console.log("Successfully set " + currentValue + " as pending");
        //     }, function(err) {
        //         console.log("Error setting " + currentValue + " registered user as pending");
        //     });
        // });
    };

    var textUnregistered = function(event, unregisteredInvitees) {
      console.log("the number of unregistered is: " + unregisteredInvitees.length);
        unregisteredInvitees.forEach(function(currentValue, index, array) {
            var phoneNumber = currentValue.phoneNumbers[0].value;
            var message = "Interested in " + event.title + ": " + event.description + "?";
            var options = {
                replaceLineBreaks: false, // true to replace \n by a new line, false by default
                android: {
                    intent: '' // send SMS with the native android SMS messaging
                    //intent: '' // send SMS without open any other app
                    //intent: 'INTENT' // send SMS inside a default SMS app
                }
            };

            $cordovaSms
                .send(phoneNumber, message, options)
                .then(function() {
                    console.log("Successfully sent text to: " + phoneNumber);
                }, function(err) {
                    console.log("Failed sending invitation to: " + phoneNumber);
                });
        });
    };

    this.title;
    this.description;
    // confirmed dates
    // suggested dates. not confirmed
    this.dates = [];
    this.location;
    this.tags = [];
    this.invitees = {
        registered: [],
        unregistered: []
    };
    this.type;

    this.create = function(event) {
        var result = eventPromise(event);
        return result.then(function(result) {
            updateInvitations($rootScope.userId, result.id, event.invitees.registered);
            textUnregistered(event, event.invitees.unregistered);
            return true;
        }, function(err) {
            return false;
        });
    };

    this.suggest = function(event) {
        // do something
        // suggestEventPromise(event);
        // updateInvitations($rootScope.userId, event.invitees.registered);
        // textUnregistered(event, event.invitees.unregistered);
    };

    this.showSuccessPopup = function() {
        $ionicPopup.alert({
            title: 'Event',
            template: 'Successfully created event'
        });
    };

    this.showFailPopup = function() {
        $ionicPopup.alert({
            title: 'Event',
            template: 'Failed to create event'
        });
    };

    this.reset = function() {
        this.title = (function() { return; })();
        this.description = (function() { return; })();
        // confirmed dates
        // suggested dates. not confirmed
        this.dates = [];
        this.location = (function() { return; })();
        this.tags = [];
        this.invitees = {
            registered: [],
            unregistered: []
        };
        this.type = (function() { return; })();
    };

    this.getByIdPromise = function(eventId) {
        return eventsTable.where({
            id: eventId
        }).read();
    };
  }])

  .factory('$localstorage', ['$window', function($window) {
    return {
      set: function(key, value) {
        $window.localStorage[key] = value;
      },
      get: function(key, defaultValue) {
        return $window.localStorage[key] || defaultValue;
      },
      setObject: function(key, value) {
        $window.localStorage[key] = JSON.stringify(value);
      },
      getObject: function(key) {
        return JSON.parse($window.localStorage[key] || '{}');
      }
    }
  }])

  .factory('$friend', ['$rootScope', function($rootScope) {
    var friends = [];
    var pendingFriends = [];
    var friendRequests = [];

    return {
      getAllFriends: function(scope) {
        friends = [];
        pendingFriends = [];
        friendRequests = [];
        $rootScope.client.invokeApi("importfriends/GetAllFriends?userId=" + $rootScope.userId, { method: "GET" }).done(function(response) {
          friends = response.result.allFriends;
          pendingFriends = response.result.pendingFriends;
          friendRequests = response.result.requests;
          if (scope != undefined) {
            scope.friends = friends;
            scope.$apply();
            scope.$broadcast('scroll.refreshComplete');
          }
        }, function (error) {
            console.log("fail querying importfriends/getallfriends: " + error);
        })
        return friends;
      },
      empty: function() {
        return friends.length == 0;
      },
      currentFriends: function() {
        return friends;
      },
      allFriends: function() {
        return friends.concat(pendingFriends).concat(friendRequests);
      }
    }
  }])

  .factory('$loginTasks', ['$rootScope', '$friend', function($rootScope, $friend) {

    return {
      /*
        This methods registers a device token with a userId
      */
      sendDeviceToken: function(userId) {
        if (window.localStorage["device_token"] == "" || window.localStorage["device_token"] == undefined) {
          return;
        }
        var userDeviceTable = $rootScope.client.getTable('DeviceToken');
        userDeviceTable.insert({ userId: userId, DeviceToken: window.localStorage["device_token"] }).done(function(result) {
            console.log("successfully send device token");
        }, function (err) {
          console.log("error sending device token");
        });
      },
      /*
          This method is called whenever a user logs in. It checks friend db for any existing friends request for this user as the receiver
          Eventually it should be changed to use push notifications rather than client request
      */
      findFriendRequests: function(currentUserId) {
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
      },
      /*
          This method will alert the user that they have a friend request from the person's name
          It converts the id returned by the find friend request into the friends name by calling the user table
          After confirming the friendship, this method updates the status of the friend relationship to 1 (accepted)
      */
      alertFriendRequestById: function(id, friendsTable, friendRequest) {
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
      },

      getCurrentFriends: function() {
        $friend.getAllFriends();
      }
    }
  }])
