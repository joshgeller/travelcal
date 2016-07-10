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
    vm.selectedLink = selectedLink;

    vm.links = [
      {'text': 'Budget', 'link': '#budget'},
      {'text': 'Trip List', 'link': '#triplist'}
    ];

    function selectedLink(index) {
      var i;
      if (index >= 0) {
        vm.links[index].selected = true;
      }
      for (i = 0; i < vm.links.length; i++) {
        if (i != index) {
          vm.links[i].selected = false;
        }
      }
    }
  
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
