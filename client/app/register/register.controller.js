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
            if (res.data.detail.email) {
              var err = res.data.detail.email[0];
              if (err === 'This field is required.') {
                err = 'Please enter a valid e-mail address.';
              }
              vm.alerts.push({
                message: err,
                type: config.alerts.ERROR
              });
            }
            if (res.data.detail.password) {
              var err = res.data.detail.password[0];
              if (err === 'This field is required.') {
                err = 'Please enter a password (6 characters minimum)';
              }
              vm.alerts.push({
                message: err,
                type: config.alerts.ERROR
              });
            }

        }
      });
    }
  }

})();
