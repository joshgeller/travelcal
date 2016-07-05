(function() {
  'use strict';

  angular
    .module('travelcal.register')
    .controller('RegisterController', RegisterController);

  RegisterController.$inject = [
    '$http'
  ];

  function RegisterController($http) {
    var vm = this;
    vm.email = '';
    vm.password = '';
    vm.register = function () {
      return $http.post('/api/v1/accounts/', {
        password: vm.password,
        email: vm.email
      });
    }
  }

})();
