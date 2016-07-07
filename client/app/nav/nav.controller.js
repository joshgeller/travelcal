(function() {
  'use strict';

  angular
    .module('travelcal.nav')
    .controller('NavController', NavController);

  NavController.$inject = [
  ];

  function NavController() {
    var vm = this;
    vm.pageTitle = 'Dynamic Page Title';
  }

})();
