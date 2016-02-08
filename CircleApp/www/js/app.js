// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })
  .state('tab.event', {
	  url: '/event',
	  views: {
		  'tab-event': {
			  templateUrl: 'templates/event-home.html',
			  controller: 'EventCtrl'
		  }
	  }

  })
  .state('event', {
      url: '/event/detail',
      templateUrl: 'templates/event-detail.html',
      controller: 'EventDetailCtrl'
  })
  .state('eventInvite', {
      url: '/event/invite',
      templateUrl: 'templates/event-invite.html',
      controller: 'EventInviteCtrl'
  })
  .state('eventDate', {
      url: '/event/date',
      templateUrl: 'templates/event-date.html',
      controller: 'EventDateCtrl'
  })
  .state('tab.friends', {
    url: '/friends',
    views: {
      'tab-friends': {
        templateUrl: 'templates/friends-home.html',
        controller: 'FriendsCtrl'
      }
    }
  })
  .state('importfriends', {
      url: '/friends/importfriends',
      templateUrl: 'templates/import.html',
      controller: 'ImportCtrl'
  })
  .state('searchfriends', {
      url: '/friends/searchfriends',
      templateUrl: 'templates/search.html',
      controller: 'SearchCtrl'
  })
  .state('invitefriends', {
      url: '/friends/invitefriends',
      templateUrl: 'templates/invite.html',
      controller: 'InviteCtrl'
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});
