(function () {
  'use strict';

  angular
    .module('travelcal.triplist')
    .config(RegisterConfig);

    RegisterConfig.$inject = [
      '$stateProvider',
      '$urlRouterProvider'
    ];

    function RegisterConfig($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/');
      $stateProvider
        .state('travelcal.triplist', {
          url: '/triplist',
          views: {
            'travelcalContent': {
              templateUrl: 'static/app/triplist/triplist.template.html',
              controller: 'TriplistController',
              controllerAs: 'vm'
            }
          }
        })
    }
})();
