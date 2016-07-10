// Authentication method derived from: https://github.com/cornflourblue/angular-jwt-authentication-example/

(function () {
  'use strict';

  angular
    .module('travelcal.profile')
    .config(ProfileConfig);

    ProfileConfig.$inject = [
      '$stateProvider'
    ];

    function ProfileConfig($stateProvider) {
      $stateProvider
        .state('travelcal.profile', {
          url: '/profile',
          views: {
            'travelcalContent': {
              templateUrl: 'static/app/profile/profile.template.html',
              controller: 'ProfileController',
              controllerAs: 'vm'
            }
          }
        });
    }

})();
