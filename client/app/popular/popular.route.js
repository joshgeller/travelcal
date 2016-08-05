(function () {
  'use strict';

  angular
    .module('travelcal.popular')
    .config(PopularConfig);

    PopularConfig.$inject = [
      '$stateProvider'
    ];

    function PopularConfig($stateProvider) {
      $stateProvider
        .state('travelcal.popular', {
          url: '/popular',
          views: {
            'travelcalContent': {
              templateUrl: 'static/app/popular/popular.template.html',
              controller: 'PopularController',
              controllerAs: 'vm'
            }
          }
        })
    }
})();
