(function () {
  'use strict';

  angular
    .module('travelcal.home')
    .config(HomeConfig);

    HomeConfig.$inject = [
      '$stateProvider',
      '$urlRouterProvider'
    ];

    function HomeConfig($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/');
      $stateProvider
        .state('travelcal.home', {
          url: '/',
          views: {
            'travelcalContent': {
              templateUrl: 'static/app/home/home.template.html',
              controller: 'HomeController',
              controllerAs: 'vm'
            }
          }
        });
    }
})();
