(function() {
  'use strict';

  angular
    .module('travelcal.home')
    .controller('HomeController', HomeController);

  HomeController.$inject = [
  ];

  function HomeController() {
    var vm = this;
    vm.pageTitle = 'Dynamic Page Title';
  }

})();
