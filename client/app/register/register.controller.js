(function() {
  'use strict';

  angular
    .module('travelcal.register')
    .controller('RegisterController', RegisterController);

  RegisterController.$inject = [
    '$http',
    'config',
    '$state'
  ];

  function RegisterController($http, config, $state) {
    var vm = this;
    vm.email = '';
    vm.password = '';
    vm.alerts = [];
    vm.forms = {};
    vm.register = function() {
      while(vm.alerts.length) {
        vm.alerts.pop();
      }
      if (vm.forms.registerForm.$invalid) return;
      return $http.post('/api/v1/accounts/', {
        password: vm.password,
        email: vm.email
      })
      .then(function(res) {
        vm.alerts.push({
          message: 'Account created. You may now log in.',
          type: config.alerts.SUCCESS
        });
      }, function(res) {
        if (res.status > -1 && res.data.detail) {
          // Iterate through invalid fields, res.data.detail is a string, not sure what it
          // looks like if there are more than one error response, but this seems to work for
          // the one error message we get
            vm.alerts.push({
              message: res.data.detail,
              type: config.alerts.ERROR
            });
        }
      });
    }
  }

})();
