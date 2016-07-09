(function () {
  'use strict';

  angular
    .module('travelcal')
    .factory('AuthenticationService', AuthenticationService);

  AuthenticationService.$inject = [
    '$http',
    '$localStorage'
  ];

  function AuthenticationService($http, $localStorage) {
    var service = { };

    service.login = login;
    service.logout = logout;

    return service;

    function login(username, password, callback) {
      var response = { };
      response.token = 'faketoken';
      // store username and token so that user remains logged in between page refreshes
      $localStorage.authenticatedUser = { username: username, token: response.token };

      // add jwt token to auth header for all requests made by the $http service
      $http.defaults.headers.common.Authorization = 'Bearer ' + response.token;
      
      // indicate successful login
      callback(true);
    }


    function logout() {
      // remove user from local storage and clear http auth header
      delete $localStorage.authenticatedUser;
      $http.defaults.headers.common.Authorization = '';
    }
  }
})();
