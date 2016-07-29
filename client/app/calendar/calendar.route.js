(function () {
  'use strict';

  angular
    .module('travelcal.calendar')
    .config(CalendarConfig);

    CalendarConfig.$inject = [
      '$stateProvider'
    ];

    function CalendarConfig($stateProvider) {
      $stateProvider
        .state('travelcal.calendar', {
          url: '/calendar',
          views: {
            'travelcalContent': {
              templateUrl: 'static/app/calendar/calendar.template.html',
              controller: 'CalendarController',
              controllerAs: 'vm'
            }
          }
        })
    }
})();
