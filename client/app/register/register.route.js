(function () {
  'use strict';

  angular
    .module('travelcal.register')
    .config(RegisterConfig);

    RegisterConfig.$inject = [
      '$stateProvider'
    ];

    function RegisterConfig($stateProvider) {
      $stateProvider
        .state('travelcal.register', {
          url: '/register',
          views: {
            'travelcalContent': {
              templateUrl: 'static/app/register/register.template.html',
              controller: 'RegisterController',
              controllerAs: 'vm'
            }
          }
        });
    }

})();
