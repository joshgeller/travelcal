(function() {
  'use strict';

  angular
    .module('travelcal.layout')
    .config(LayoutConfig);

    LayoutConfig.$inject = [ 
      '$stateProvider',
      '$urlRouterProvider'
    ];

    function LayoutConfig($stateProvider, $urlRouterProvider) {
      $stateProvider 
        .state('travelcal', {
          abstract: true,
          views: {
            'travelcalMain': {
              templateUrl: 'static/app/layout/layout.template.html'
            }
          }
        });
    }
})();
