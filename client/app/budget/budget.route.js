(function () {
  'use strict';

  angular
    .module('travelcal.budget')
    .config(BudgetConfig);

    RegisterConfig.$inject = [
      '$stateProvider'
    ];

    function RegisterConfig($stateProvider) {
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
