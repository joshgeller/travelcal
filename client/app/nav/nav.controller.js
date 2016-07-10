(function() {
  'use strict';

  angular
    .module('travelcal.nav')
    .controller('NavController', NavController);

  NavController.$inject = [
    '$state'
  ];

  function NavController($state) {
    var vm = this;
    vm.login = login;
    vm.logout = logout;
    vm.openMenu = openMenu;
    vm.pageTitle = 'Dynamic Page Title';
  
    function login() {
      $state.go('travelcal.login');
    }

    function logout() {
      $state.go('travelcal.logout');
    }
    function openMenu($mdOpenMenu, ev) {
      $mdOpenMenu(ev);
    }
  }

})();
