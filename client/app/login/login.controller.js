(function() {
  'use strict';

  angular
    .module('travelcal.login')
    .controller('LoginController', LoginController);

  LoginController.$inject = [
    'AuthenticationService',
    '$location'
  ];

  function LoginController(AuthenticationService, $location) {
    var vm = this;

    vm.login = login;
    vm.logout = logout;
    vm.register = register;
    vm.alerts = [];
    vm.forms = {};
    vm.username = '';
    vm.password = '';

    function login() {
      while(vm.alerts.length) vm.alerts.pop();
      AuthenticationService.login(
        vm.username,
        vm.password,
        function(authenticated, res) {
          if (authenticated) {
            $location.path('/triplist');
          } else {
            console.log('auth error')
          }
        });
    }
    
    function logout() {
      console.log("Logging out!");
      AuthenticationService.logout();
    }

    function register() {
      $location.path('/register');
    }
  }
})();
