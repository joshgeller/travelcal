(function() {
  'use strict';

  angular
    .module('travelcal.profile')
    .controller('ProfileController', ProfileController);

  ProfileController.$inject = [
    '$localStorage',
    '$http'
  ];

  function ProfileController($localStorage, $http) {
    var vm = this;
    vm.newPassword = '';

    vm.update = function () {
       $http.post('/api/v1/accounts/', {
        email: vm.username,
        password: vm.newPassword
      })
      .then(function(res) {
        console.log(res);
        vm.alerts.push({
          message: 'Account created. You may now log in.',
          type: config.alerts.SUCCESS
        });
      }, function(res) {
        console.log(res);
      })
    }


    vm.username = $localStorage.authenticatedUser.username;
  }

})();
