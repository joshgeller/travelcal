(function() {
  'use strict';

  angular
    .module('travelcal.profile')
    .controller('ProfileController', ProfileController);

  ProfileController.$inject = [
  ];

  function ProfileController() {
    var vm = this;
    vm.pageTitle = 'Dynamic Page Title';
  }

})();
