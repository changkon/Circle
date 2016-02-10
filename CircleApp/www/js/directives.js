// js file for defining and maintaining directives inside Circle app
// loads the app module
(function() {
	var app = angular.module('starter');

	app.directive('circleNav', function() {
		return {
			restrict: 'E', // restrict directive to only element tag
			templateUrl: '../templates/nav.html',
			controller: 'NavCtrl'
		};
	});
	
	app.directive('circlePlusButton', function() {
		return {
			restrict: 'C',
			templateUrl: '../templates/plus-button.html'
		}
	});
    
    app.directive('circleCalendar', function() {
        
        function removeTime(date) {
            return date.day(0).hour(0).minute(0).second(0).millisecond(0);
        }
        
        function buildMonth(scope, start, month) {
            scope.weeks = [];
            var done = false;
            var date = start.clone();
            var monthIndex = date.month();
            var count = 0;
            
            while (!done) {
                scope.weeks.push({ days: buildWeek(date.clone(), month) });
                date.add(1, "w");
                done = count++ > 2 && monthIndex !== date.month();
                monthIndex = date.month();
            }
            
        }
        
        function buildWeek(date, month) {
            var days = [];
            for (var i = 0; i < 7; i++) {
                days.push({
                    name: date.format("dd").substring(0,1), // get only the day section
                    number: date.date(),
                    isCurrentMonth: date.month() === month.month(),
                    isToday: date.isSame(new Date(), "day"),
                    date: date
                });
                date = date.clone();
                date.add(1, "d");
            }
            return days;
        }
        
        return {
            restrict: 'E', //restrict directive to only element tag
            templateUrl: '../templates/calendar.html',
            scope: {
                selected: "="
            },
            link: function(scope) {
                scope.selected = removeTime(scope.selected || moment());
                scope.month = scope.selected.clone();
                
                var start = scope.selected.clone();
                start.date(1);
                removeTime(start.day(0));
                
                buildMonth(scope, start, scope.month);
                
                scope.select = function(day) {
                    scope.selected = day.date;
                    console.log(scope.selected);
                };
                
                scope.next = function() {
                    var next = scope.month.clone();
                    removeTime(next.month(next.month()+1)).date(1);
                    scope.month.month(scope.month.month()+1);
                    buildMonth(scope, next, scope.month);
                };
                
                scope.previous = function() {
                    var previous = scope.month.clone();
                    removeTime(previous.month(previous.month()-1).date(1));
                    scope.month.month(scope.month.month()-1);
                    buildMonth(scope, previous, scope.month);
                };
            }
        }
    });
})();