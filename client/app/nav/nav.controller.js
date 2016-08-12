(function() {
  'use strict';

  angular
    .module('travelcal.nav')
    .controller('NavController', NavController);

  NavController.$inject = [
    '$localStorage',
    '$state',
    'AuthenticationService'
  ];

  function NavController($localStorage, $state, AuthenticationService) {
    var vm = this;
    vm.authenticated = false;
    vm.login = login;
    vm.logout = logout;
    vm.openMenu = openMenu;
    vm.pageTitle = 'Dynamic Page Title';
    vm.profile = profile;
    vm.triplist = triplist;
    vm.selectedLink = selectedLink;
    vm.init = init;
    vm.brand = brand;

    vm.links = [
      {'text': 'Budget', 'link': '#budget'},
      {'text': 'Trip List', 'link': '#triplist'},
    ];

    init()

    function init() {
      vm.authenticated = ($localStorage.authenticatedUser !== undefined);
    }

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

    function brand(){
      vm.authenticated = ($localStorage.authenticatedUser !== undefined);
      if (vm.authenticated) {
        $state.go('travelcal.triplist');
      } else {
        $state.go('travelcal.home');
      }
    }

    function login() {
      $state.go('travelcal.login');
    }

    function logout() {
      AuthenticationService.logout();
      $state.go('travelcal.login');
    }

    function profile() {
      $state.go('travelcal.profile');
    }

    function triplist() {
      $state.go('travelcal.triplist');
    }

    function openMenu($mdOpenMenu, ev) {
      vm.authenticated = ($localStorage.authenticatedUser !== undefined);
      $mdOpenMenu(ev);
    }
  }

})();
