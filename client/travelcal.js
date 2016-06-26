var app = angular.module('myApp', ['ngRoute']);
app.controller('RegisterCtrl', function ($scope, $http) {
  $scope.email = '';
  $scope.password = '';
  $scope.register = function () {
    return $http.post('/api/v1/accounts/', {
      password: $scope.password,
      email: $scope.email
    });
  }
});
app.config(function ($interpolateProvider) {
  $interpolateProvider.startSymbol('{$');
  $interpolateProvider.endSymbol('$}');
});
app.config(function ($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider.
  when("/", { templateUrl: "static/templates/home.html"}).
  when("/register", { templateUrl: "static/auth/register.html", "controller": "RegisterCtrl" }).
  otherwise({ redirectTo: "/404" });
});
