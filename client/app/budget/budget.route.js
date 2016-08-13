(function () {
  'use strict';

  angular
    .module('travelcal.budget')
    .config(BudgetConfig);

    BudgetConfig.$inject = [
      '$stateProvider'
    ];

    function BudgetConfig($stateProvider) {
      $stateProvider
        .state('travelcal.budget', {
          url: '/budget',
          params: {
            tripId: null
          },
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
