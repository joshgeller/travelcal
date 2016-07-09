(function() {
  'use strict';

  angular
    .module('travelcal.nav')
    .controller('NavController', NavController);

  NavController.$inject = [
  ];

  function NavController() {
    var vm = this;
    vm.openMenu = openMenu;
    vm.pageTitle = 'Dynamic Page Title';
    
    function openMenu($mdOpenMenu, ev) {
      console.log("OPEN");
      console.log(ev);
      console.log($mdOpenMenu);
      originatorEv = ev;
      $mdOpenMenu(ev);
    }
  }

})();
