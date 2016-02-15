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
                many: '=',
                selected: '='
            },
            link: function(scope, element, attrs) {
                scope.initial = removeTime(scope.initial || moment());
                scope.selected.push(scope.initial);
                scope.month = scope.initial.clone();

                var start = scope.initial.clone();
                start.date(1);
                removeTime(start.day(0));

                buildMonth(scope, start, scope.month);

                scope.select = function(day) {
                    if (scope.many === true) {
                        var arr = scope.selected;
                        var index = arr.findIndex(function(element, index, array) {
                            return element.isSame(this);
                        }, day.date);

                        if (index == -1) {
                            scope.selected.push(day.date);
                        } else {
                            // delete
                            scope.selected.splice(index, 1);
                        }
                    } else {
                        // override first element
                        scope.selected[0] = day.date;
                    }
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

                // checks if date is the same as any of the currently selected ones
                scope.matchAny = function(date) {
                    for (var i = 0; i < scope.selected.length; i++) {
                        if (date.isSame(scope.selected[i])) {
                            return true;
                        }
                    }
                    return false;
                }
            }
        }
    });

    app.directive('circleTimeView', function() {
        return {
            restrict: 'E',
			templateUrl: '../templates/time.html',
            scope: {
                dates: '='
            },
            link: function(scope) {

            }
        };
    });

	app.directive('compareTo', function() {
		return {
			require: "ngModel",
			scope: {
				otherModelValue : "=compareTo"
			},
			link : function(scope,element, attributes,ngModel) {

				ngModel.$validators.compareTo = function(modelValue) {
					return modelValue == scope.otherModelValue;
				};

				scope.$watch("otherModelValue", function() {
					ngModel.$validate();
				});
			}
		};
	});
})();
