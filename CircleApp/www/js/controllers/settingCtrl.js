var myApp = angular.module('starter.controllers');

myApp.controller('SettingCtrl', function($scope, $rootScope, $localstorage){
  
  var settingObject = $localstorage.getObject('userSetting');
  var temp = settingObject.notifyDefault;
  if (temp == "Text") {
      $scope.mySelect ='Text';
  } else if (temp == "Email") {
      $scope.mySelect ='Email';
  }
  $scope.logout = function() {
      $localstorage.set("currentToken",'none');
  }
  
  $scope.changeDefault = function(mySelect) {
      $localstorage.set('defaultNotification',mySelect);
  }

})
