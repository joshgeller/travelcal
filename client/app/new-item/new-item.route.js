(function () {
  'use strict';

  angular
    .module('travelcal.new-item')
    .config(NewItemConfig);

    NewItemConfig.$inject = [
      '$stateProvider'
    ];

    function NewItemConfig($stateProvider) {
      $stateProvider
        .state('travelcal.new-item', {
          url: '/new-item',
          views: {
            'travelcalContent': {
              templateUrl: 'static/app/new-item/new-item.template.html',
              controller: 'NewItemController',
              controllerAs: 'vm'
            }
          }
        })
    }
})();
