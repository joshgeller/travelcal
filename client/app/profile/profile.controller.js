(function() {
  'use strict';

  angular
    .module('travelcal.profile')
    .controller('ProfileController', ProfileController);

  ProfileController.$inject = [
    '$localStorage',
    '$http',
    'config'
  ];

  function ProfileController($localStorage, $http, config) {
    var vm = this;
    vm.newPassword = '';
    vm.alerts = [];

    vm.update = function () {
       $http.post('/api/v1/accounts/set_password/', {
        email: vm.username,
        password: vm.newPassword
      })
      .then(function(res) {
        vm.alerts.push({
          message: 'Your password was successfully changed.',
          type: config.alerts.SUCCESS
        });
      }, function(res) {
      })
    }
    vm.username = $localStorage.authenticatedUser.username;
  }

})();
