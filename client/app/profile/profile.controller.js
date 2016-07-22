(function() {
  'use strict';

  angular
    .module('travelcal.profile')
    .controller('ProfileController', ProfileController);

  ProfileController.$inject = [
    '$localStorage'
  ];

  function ProfileController($localStorage) {
    var vm = this;
    vm.pageTitle = 'Dynamic Page Title';

    vm.username = $localStorage.authenticatedUser.username;
  }

})();
