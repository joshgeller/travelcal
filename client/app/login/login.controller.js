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
    vm.email = '';
    vm.password = '';
  
    function login() {
      vm.loading = true;
      console.log("LOGGING IN"); 
      AuthenticationService.login(vm.username, vm.password, function (result) {
        if (result === true) {
          $location.path('/');
        } else {
          vm.error = 'Username or password is incorrect';
          vm.loading = false;
        }
      });
    }
  }

})();
