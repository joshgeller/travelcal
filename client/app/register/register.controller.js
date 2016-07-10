(function() {
  'use strict';

  angular
    .module('travelcal.register')
    .controller('RegisterController', RegisterController);

  RegisterController.$inject = [
    '$http',
    'config'
  ];

  function RegisterController($http, config) {
    var vm = this;
    vm.email = '';
    vm.password = '';
    vm.alerts = [];
    vm.forms = {};
    vm.register = function() {
      while(vm.alerts.length) vm.alerts.pop();
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
          // Iterate through invalid fields
          for (var field in res.data.detail) {
            // Display all alerts for this field
            for (var err of res.data.detail[field]) {
              vm.alerts.push({
                message: err,
                type: config.alerts.ERROR
              });
            }
          }
        }
      })
    }
  }

})();
