(function() {
  'use strict';

  angular
    .module('travelcal.login')
    .controller('LoginController', LoginController);

  LoginController.$inject = [
    'AuthenticationService',
    '$location',
    'config'
  ];

  function LoginController(AuthenticationService, $location, config) {
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
            vm.alerts.push({
              message: 'Unable to login with the provided credentials.',
              type: config.alerts.ERROR
            });
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
