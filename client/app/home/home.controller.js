(function() {
  'use strict';

  angular
    .module('travelcal.home')
    .controller('HomeController', HomeController);

  HomeController.$inject = [
    '$state',
    'AuthenticationService',
    '$localStorage'
  ];

  function HomeController($state, AuthenticationService, $localStorage) {
    var vm = this;
    var init = init;
    init();

    function init() {
      // redirect authenticated users to their trip list
      if ($localStorage.authenticatedUser) {
        $state.go('travelcal.triplist')
      }
    }

  }

})();
