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
    
    var eventDeletePromise = function(idToDelete) {
        return eventsTable.del({
            id: idToDelete
        });
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
}]);
