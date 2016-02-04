angular.module('starter.controllers', [])

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
			$rootScope.client = new WindowsAzure.MobileServiceClient('http://192.168.1.69:50770').withFilter(function (request, next, callback) {
               request.headers['x-zumo-auth'] = response.token;
               next(request, callback);
            });
        })
        .error(function(data, status, headers, config) {
            // handle error things
            console.log("Error occurred - " + status);
        })
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
            data: {email: $scope.user.email, phoneNumber: $scope.user.phoneNumber, 
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

.controller('ChatsCtrl', function($scope, Chats, $rootScope) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  $scope.$on('$ionicView.enter', function(e) {
     //Chats.get(0).name = $rootScope.token + " - token"
     try {
       var client = $rootScope.client;
        todoItemTable = client.getTable('todoitem');
        todoItemTable.insert({ text: "first to do thing", complete: false });
        /*
        var query = todoItemTable.where({ complete: false });
        query.read().then(function(todoItems) {
          //console.log(todoItems.length + " - " + Chats.all().length)
          for (i = 0; i < todoItems.length && i < Chats.all().length; i++) {
            Chats.get(i).name = todoItems[i].id;
            Chats.get(i).lastText = todoItems[i].text;
          }
        }, function (error) {
            Chats.get(0).lastText = "fail-" + error
        }); */
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

.controller('EventCtrl', function($scope, $http, $rootScope) {
	$scope.event = {};
	$scope.events = [];
	
	$scope.query = function() {
		var mobileService = $rootScope.client;
		var eventsTable = mobileService.getTable('event');
		eventsTable.read().done(function(results) {
			$scope.$apply(function() {
				$scope.events = results;
			});
		}, function(err) {
			console.log("Error: " + err);
		});
	};
	
	$scope.$on('$ionicView.enter', function(e) {
		$scope.query();
	});
	
	$scope.create = function() {
		console.log("Creating event with details:");
		console.log("Title - " + $scope.event.title);
		console.log("Description - " + $scope.event.description);
		console.log("Date - " + $scope.event.date);
		console.log("Location - " + $scope.event.location);
		
		// retrieve the mobile service instance
		var mobileService = $rootScope.client;
		var eventsTable = mobileService.getTable('event');
		
		eventsTable.insert({
			title: $scope.event.title,
			description: $scope.event.description,
			date: $scope.event.date,
			location: $scope.event.location
		}).done(function(result) {
			console.log("success");
		}, function (err) {
			console.log("error");
			console.log(err);
		});
		
	};
});
