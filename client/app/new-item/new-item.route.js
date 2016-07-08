(function () {
  'use strict';

  angular
    .module('travelcal.new-item')
    .config(NewItemConfig);

    NewItemConfig.$inject = [
      '$stateProvider',
      '$urlRouterProvider'
    ];

    function NewItemConfig($stateProvider, $urlRouterProvider) {
      $stateProvider
        .state('travelcal.new-item', {
          url: '/new-item',
          views: {
            'travelcalMain': {
              templateUrl: 'static/app/new-item/new-item.template.html',
              controller: 'NewItemController',
              controllerAs: 'vm'
            }
          }
        })
    }
})();
