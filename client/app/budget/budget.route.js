(function () {
  'use strict';

  angular
    .module('travelcal.budget')
    .config(RegisterConfig);

    RegisterConfig.$inject = [
      '$stateProvider',
      '$urlRouterProvider'
    ];

    function RegisterConfig($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/');
      $stateProvider
        .state('travelcal.budget', {
          url: '/budget',
          views: {
            'travelcalContent': {
              templateUrl: 'static/app/budget/budget.template.html',
              controller: 'BudgetController',
              controllerAs: 'vm'
            }
          }
        })
    }
})();
