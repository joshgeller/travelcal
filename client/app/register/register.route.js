(function () {
  'use strict';

  angular
    .module('travelcal.register')
    .config(RegisterConfig);

    RegisterConfig.$inject = [
      '$stateProvider',
      '$urlRouterProvider'
    ];

    function RegisterConfig($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/');
      $stateProvider
        .state('registerState', {
          url: '/register',
          views: {
            'travelcalMain': {
              templateUrl: 'static/app/register/register.template.html',
              controller: 'RegisterController',
              controllerAs: 'vm'
            }
          }
        })
    }
})();
