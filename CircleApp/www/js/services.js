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
.service('event', ['$rootScope', '$cordovaSms', function($rootScope, $cordovaSms) {
    // Create enum.
    var EventStatus = Object.freeze({
        "HOST": 0,
        "ATTENDING": 1,
        "NOTGOING": 2,
        "PENDING": 3
    });
    
    // retrieve the mobile service instance
    var mobileService = $rootScope.client;
    var eventsTable = mobileService.getTable('event');
    var invitationsTable = mobileService.getTable('invitation');
    
    // creates event and inserts into eventtable
    var createEvent = function(event) {
        eventsTable.insert({
			title: event.title,
			description: event.description,
			startDate: event.startDate,
            endDate: event.endDate,
			location: event.location
		}).done(function(result) {
			console.log("Succesfully created event");
		}, function (err) {
			console.log("Error creating event");
			console.log(err);
		});
    };
    
    // updates invitations table
    var updateInvitations = function(userId, registeredInvitees) {
        // set userId to be HOST of event
        
    };
    
    var textUnregistered = function(unregisteredInvitees) {
        console.log("Text unregistered numbers");
    };
    
    this.title;
    this.description;
    // confirmed dates
    this.startDate;
    this.endDate;
    // suggested dates. not confirmed
    this.proposedDates = [];
    this.location;
    this.tags = [];
    this.invitees = {
        registered: [],
        unregistered: []
    };
    
    this.create = function(event) {
        createEvent(event);
        updateInvitations($rootScope.userId, event.invitees.registered);
        textUnregistered(event.invitees.unregistered);
    };
}]);
