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
      return $http.post('/api-token-auth/', {
        username: username,
        password: password
      })
      .then(function(res) {
        // store username and token so that user remains logged in between page refreshes
        $localStorage.currentUser = { username: username, token: res.data.token };
        // add auth token to header for all requests made by the $http service
        $http.defaults.headers.common.Authorization = 'Token ' + res.data.token;
        // indicate successful login
        callback(true, res);
      }, function(res) {
        // unsuccessful login
        callback(false, res);
      })
    }


    function logout() {
      // remove user from local storage and clear http auth header
      delete $localStorage.currentUser;
      $http.defaults.headers.common.Authorization = '';
    }
  }
})();
