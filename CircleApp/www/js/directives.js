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
