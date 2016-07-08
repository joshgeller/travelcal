(function () {
  'use strict';

  angular
    .module('travelcal.budget')
    .config(BudgetConfig);

    BudgetConfig.$inject = [
      '$stateProvider',
      '$urlRouterProvider'
    ];

    function BudgetConfig($stateProvider, $urlRouterProvider) {
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
