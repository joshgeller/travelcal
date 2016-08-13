(function () {
  'use strict';

  angular
    .module('travelcal.calendar')
    .controller('CalendarController', CalendarController);

  CalendarController.$inject = [
    '$scope',
    '$window',
    '$mdDialog',
    '$mdMedia',
    '$compile',
    'uiCalendarConfig',
    '$location',
    'TripService',
    'CalendarService',
    'moment',
    'ActivityService',
    'config'
  ];

  function CalendarController(
    $scope,
    $window,
    $mdDialog,
    $mdMedia,
    $compile,
    uiCalendarConfig,
    $location,
    TripService,
    CalendarService,
    moment,
    ActivityService,
    config
  ) {

    var vm = this;
    var activitiesSource;
    var _calendar;

    vm.customFullscreen;
    vm.events = [];
    vm.alerts = [];
    $scope.eventSources = [];
    $scope.uiConfig = {};

    vm.init = init;

    // 'private' members
    var tripId;

    function init() {
      tripId = $location.search().tripId || -1;
      vm.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

      /* config object BASED ON CODE FROM CALENDAR DOCUMENTATION */
      $scope.uiConfig = {
        calendar: {
          timezone: 'utc',
          height: 450,
          editable: false,
          header: {
            left: 'title',
            center: '',
            right: 'today prev,next'
          },
          eventRender: eventRender,
          eventClick: onEventClick,
          dayClick: onDayClick
        }
      };

      if (tripId > -1) {
        TripService.retrieve(tripId)
          .then(function(response) {
            vm.trip = response.data;
            vm.title = vm.trip.name;

            var dateRange = {
              color: '#f00',
              events: [
                { title: 'TRIP START', start: vm.trip.start_date, class: 'trip_start', allDay: true },
                { title: 'TRIP END', start: vm.trip.end_date, class: 'trip_end', allDay: true }
              ]
            };

            activitiesSource  = [];

            if (vm.trip.calendar.data) {
              activitiesSource = angular.copy(vm.trip.calendar.data);
            }

            // eventSources[0] is trips
            $scope.eventSources[0] = dateRange;
            // eventSources[1] is activities
            $scope.eventSources[1] = activitiesSource;

            goToTripStart();

          }, function(error) {
            console.log('error');
          });
      }
    }

    // Take the calendar to the appropriate month for the trip
    function goToTripStart() {
      var startDate = vm.trip.start_date;
      uiCalendarConfig.calendars.tripCalendar.fullCalendar('gotoDate', startDate);
    }

    // fired when an actual activity or trip event is clicked
    onEventClick.$inject = ['$event'];
    function onEventClick($event) {
       var trip = vm.trip;
      // handle changing trip dates
      if ($event.class == "trip_end" || $event.class == "trip_start") {
        return updateTripDates();
      }
      var _startDate = moment.utc($event.start, 'YYYY-MM-DD').format();
      if (!$event.allDay) {
        // all day events do not have an end date, so just set them to
        // be the same as the start date
        var _endDate = moment.utc($event.end, 'YYYY-MM-DD').format();
      } else {
        var _endDate = moment.utc($event.start, 'YYYY-MM-DD').format();
      }

      var idx;

      idx = getActivityIdx(activitiesSource, $event.id);
      var _activity = angular.copy(activitiesSource[idx]);
      _activity.start = _startDate;
      _activity.end = _endDate;

      ActivityService.editActivityForm(_activity)
        .then(function(result) {
          if (result.GOOD) {
            if (result.data.source) {
              delete result.data.source;
            }
            // we have an activity as result;
            var _calendar = angular.copy($scope.eventSources[1]);
            idx = getActivityIdx(_calendar, result.data.id);
            if (idx >= 0) {
              _calendar.splice(idx, 1);
              if (!result.DELETE) {
                _calendar.push(result.data);
              }

              CalendarService.update(vm.trip.id, _calendar)
                .then(function(success) {
                  idx = getActivityIdx(activitiesSource, result.data.id);
                  if (idx >= 0) {
                    if (activitiesSource.length === 0) {
                      activitiesSource = [];
                    }
                    activitiesSource.splice(idx, 1);
                    if (!result.DELETE) {

                      activitiesSource.push(result.data);
                      console.log(activitiesSource);
                      $scope.eventSources[1] = activitiesSource;
                    }
                  }
                  else {
                    console.log(activitiesSource);
                  }

                }, function(error) {
                  console.log('error', error);
                });
            }
          }
          else {
            // console.log('dialog was closed');
            // do nothing
          }
        });
    }

    function getActivityIdx(_source, id) {
      for (var i = 0; i < _source.length; i++) {
        if (_source[i].id === id) {
          return i;
        }
      }
      return false;
    }

    // fired when a day on the calendar is clicked
    onDayClick.$inject = ['$event'];
    function onDayClick($event) {
      var _date = moment.utc($event, 'YYYY-MM-DD').format();

      ActivityService.createActivityForm(_date, _date)
        .then(function(result) {
          if (result.GOOD) {
            if (result.DELETE) {
              return;
            }

            // we have an activity as result;
            var _calendar = angular.copy($scope.eventSources[1]);
            _calendar.push(result.data);

            CalendarService.update(vm.trip.id, _calendar)
              .then(function(success) {
                activitiesSource.push(result.data);

              }, function(error) {
                console.log('error', error);
              });
          }
          else {
            // dialog was closed, do nothing
          }
        });
    }


    function addPopular($event, activityIn) {
      // default to trip start date
      var _date = moment.utc(vm.trip.start_date, 'YYYY-MM-DD').format();
      var _activity = angular.copy(activityIn);

      _activity.start = _date;
      _activity.end = _date;
      _activity.popular = true;

      ActivityService.editActivityForm(_activity)
        .then(function(result) {
          if (result.GOOD) {
            if (result.DELETE) {
              return;
            }

            // we have an activity as result;
            var _calendar = angular.copy($scope.eventSources[1]);
            result.data.popular = false;
            _calendar.push(result.data);

            CalendarService.update(vm.trip.id, _calendar)
              .then(function(success) {
                activitiesSource.push(result.data);

              }, function(error) {
                console.log('error', error);
              });
          }
          else {
            // dialog was closed, do nothing
          }
        });
    }


    function updateTripDates() {
      vm.trip.start_date = ActivityService.smartDate(new Date(vm.trip.start_date), false);
      vm.trip.end_date = ActivityService.smartDate(new Date(vm.trip.end_date), false);

      var addTrip = function addTrip(status, message) {
        if (status) {
          vm.title = message.data.name;
          var dateRange = {
            color: '#f00',
            events: [
              { title: 'TRIP START', start: vm.trip.start_date, class: 'trip_start', allDay: true },
              { title: 'TRIP END', start: vm.trip.end_date, class: 'trip_end', allDay: true }
            ]
          };
          // eventSources[0] is trips
          $scope.eventSources[0] = dateRange;
        }
      };

      $mdDialog.show({
        controller: 'DialogController',
        controllerAs: 'dvm',
        templateUrl: 'static/app/triplist/new-trip.template.html',
        locals: {
          edit: true,
          activity: undefined,
          start: undefined,
          trip: vm.trip
        },
        parent: angular.element(document.body),
        clickOutsideToClose:true,
        fullscreen: false
      })
        .then(function(answer) {
          answer.start_date = answer.start;
          answer.end_date = answer.end;
          TripService.update(answer.id, answer, addTrip);

        }, function() {
          $scope.status = 'No trip was added.';
        });

        $scope.$watch(function() {
          return $mdMedia('xs') || $mdMedia('sm');
        }, function(wantsFullScreen) {
          $scope.customFullscreen = (wantsFullScreen === true);
        });
    }

    /* Render Tooltip COPIED FROM CALENDAR DOCUMENTATION */
    /* doesn't do anything afaik */
    function eventRender(event, element, view) {
      element.attr({'tooltip': event.title, 'tooltip-append-to-body': true });
      $compile(element)($scope);
    };

    vm.loadBudget = function exportPDF() {
      $location.path('/budget').search({ tripId: tripId });
    }

    vm.exportPDF = function exportPDF() {
      TripService.exportPDF(tripId, function (result, response) {});
    }

    vm.triggerReminders = function triggerReminders() {
      TripService.triggerReminders(tripId, function (result, response) {
        if (result) {
          vm.alerts.push({
            message: 'Your itinerary was e-mailed to ' + response.data.email + '!',
            type: config.alerts.SUCCESS
          });
        }

      });
    }
    vm.popularActivities = function (ev) {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && vm.customFullscreen;
      $mdDialog.show({
          controller: 'PopularDialogController',
          controllerAs: 'dvm',
          templateUrl: 'static/app/calendar/popular.template.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: true,
          fullscreen: useFullScreen
        })
        .then(function (activity) {
          addPopular(ev, activity);
        }, function () {
          console.log('You cancelled the dialog.');
        });

      $scope.$watch(function () {
        return $mdMedia('xs') || $mdMedia('sm');
      }, function (wantsFullScreen) {
        vm.customFullscreen = (wantsFullScreen === true);
      });
    };

  }

})();
