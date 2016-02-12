var myApp = angular.module('starter.controllers');

myApp.controller('EventTimeCtrl', ['$scope', 'event', 'uiCalendarConfig', function($scope, event, uiCalendarConfig) {
    // var date = new Date();
    // var d = date.getDate();
    // var m = date.getMonth();
    // var y = date.getFullYear();
    
    $scope.dates = event.dates;
    
    $scope.updateDate = function(date, time) {
        var hour = time.getHours();
        var min = time.getMinutes();
        var sec = time.getSeconds();
        console.log(hour);
        console.log(min);
        console.log(sec);
        date.hour(hour).minute(min).second(sec);
        console.log("Updated scope: " + $scope.dates);
    };
    
    $scope.create = function() {
        console.log(event);
    };
    // $scope.events = [
    //     {title: 'All Day Event',start: new Date(y, m, 1)},
    //     {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
    //     {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
    //     {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
    //     {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false},
    //     {title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
    // ];
    
    // $scope.uiConfig = {
    //     calendar:{
    //         height: 450,
    //         editable: true,
    //         header:{
    //             left: 'title',
    //             center: '',
    //             right: 'today prev,next'
    //         },
    //         eventClick: $scope.alertOnEventClick,
    //         eventDrop: $scope.alertOnDrop,
    //         eventResize: $scope.alertOnResize,
    //         eventRender: $scope.eventRender
    //     }
    // };
    // $scope.eventSources = [$scope.events];
}]);