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
      'travelcal.triplist',
      'travelcal.nav'
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
