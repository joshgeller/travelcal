(function () {
  'use strict';

  angular
    .module('travelcal.triplist')
    .config(TriplistConfig);

    TriplistConfig.$inject = [
      '$stateProvider'
    ];

    function TriplistConfig($stateProvider) {
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
