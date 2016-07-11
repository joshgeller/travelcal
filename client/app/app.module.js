(function() {
  'use strict';

  angular.module(
    'travelcal',
    [
      'travelcal.core',
      'travelcal.home',
      'travelcal.layout',
      'travelcal.nav',
      'travelcal.register',
      'travelcal.new-item',
      'travelcal.budget',
      'travelcal.login',
      'travelcal.profile',
      'travelcal.triplist',
      'travelcal.nav',
      'google.places'
    ]
  );

  angular.module(
    'travelcal'
  ).constant('config', {
    alerts: {
      ERROR: 0,
      SUCCESS: 1
    }
  });

})();
