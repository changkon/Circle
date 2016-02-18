var myApp = angular.module('starter.controllers');

myApp.controller('SettingCtrl', function($scope, $rootScope, $localstorage, $state,$ionicLoading){
  
  var settingObject = $localstorage.getObject('userSetting');
  var temp = settingObject.notifyDefault;
  if (temp == "Text") {
      $scope.mySelect ='Text';
  } else if (temp == "Email") {
      $scope.mySelect ='Email';
  }
  $scope.logout = function() {
      // Asynchronously call the custom API using the POST method.
      console.log($localstorage.get('currentToken','none'));
      $ionicLoading.show({
          template: 'logging out'
        }) 
        
        
    $rootScope.client.invokeApi("logout", {
        body: {
            token: $localstorage.get('currentToken','none')
        },
        method: "post"
    }).done(function (results) {
        $ionicLoading.hide()
        console.log(JSON.stringify(results, null, 4));
        $state.go("startscreen");
    }, function (error) {
        $ionicLoading.hide()
        console.log(error.message);
    });
     $localstorage.set("currentToken","none");
     $localstorage.set("currentId","none");
     $localstorage.set("currentEmail", "none");
  }
  
  $scope.changeDefault = function(mySelect) {
      $localstorage.set('defaultNotification',mySelect);
  }

})
