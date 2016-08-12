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
    'ActivityService'
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
    ActivityService
  ) {

    var vm = this;
    var activitiesSource;
    var _calendar;

    vm.customFullscreen;
    vm.events = [];
    $scope.eventSources = [];
    $scope.uiConfig = {};

    vm.init = init;

    // 'private' members
    var tripId;

    // 'private' functions
//    var editActivity = editActivity;
//    var eventRender = eventRender;
//    var eventDataTransform = eventDataTransform;
//    var goToTripStart = goToTripStart;
//    var init = init;
//    var onDayClick = onDayClick;
//    var onEventClick = onEventClick;
//    var onEventDrop = onEventDrop;
//    var onEventResize = onEventResize;
//    var updateCalendar = updateCalendar;
//    var updateTrip = updateTrip;
//    var updateActivity = updateActivity;
//    var deleteActivity = deleteActivity;
//    var getActivity = getActivity;

    function init() {
      tripId = $location.search().tripId || -1;
      vm.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

      /* config object BASED ON CODE FROM CALENDAR DOCUMENTATION */
      $scope.uiConfig = {
        calendar: {
          timezone: 'utc',
          height: 450,
          editable: true,
          header: {
            left: 'title',
            center: '',
            right: 'today prev,next'
          },
          loading: goToTripStart,
//          eventRender: eventRender,
//          eventDataTransform: eventDataTransform,
          eventClick: onEventClick,
//          eventResize: onEventResize,
//          eventDrop: onEventDrop,
          dayClick: onDayClick
        }
      };

      if (tripId > -1) {
        TripService.retrieve(tripId)
          .then(function(response) {
            console.log('success');
            
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
            $scope.eventSources.push(dateRange);
            // eventSources[1] is activities
            $scope.eventSources.push(activitiesSource); 

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
      console.log($event);
    }

    // fired when a day on the calendar is clicked

    onDayClick.$inject = ['$event'];
    function onDayClick($event) {
      var _date = moment.utc($event, 'YYYY-MM-DD').format();

      ActivityService.createActivityForm(_date, _date)
        .then(function(result) {
          if (result) {
            // we have an activity as result;
            var _calendar = angular.copy($scope.eventSources[1]);
            _calendar.push(result);

            CalendarService.update(vm.trip.id, _calendar)
              .then(function(success) {
                //$scope.eventSources[1].push(result);
                activitiesSource.push(result);

              }, function(error) {
                console.log(error);
                console.log('error');
              });
          }
          else {
            console.log('dialog was closed');
          }
        });


      var dbug = false;

      if (dbug) {
        var _activity = {};
        _activity.start = _date;
        _activity.end = _date;
        _activity.title = 'Static Activity';

        var _calendar = angular.copy($scope.eventSources[1]);
        _calendar.push(_activity);

        CalendarService.update(vm.trip.id, _calendar)
          .then(function(success) {
            console.log(success);
            console.log('yay');
            $scope.eventSources[1].push(_activity);

          }, function(error) {
            console.log(error);
            console.log('error');
          });
      }
    }


//    Date.prototype.toJSONLocal = function () {
//      function addZ(n) {
//        return (n < 10 ? '0' : '') + n;
//      }
//      return this.getFullYear() + '-' +
//        addZ(this.getMonth() + 1) + '-' +
//        addZ(this.getDate());
//    }
//
//    function getActivity(activityArray, activityId) {
//      for (var i = 0; i < activityArray.length; i++) {
//        if (activityArray[i].id == activityId) {
//          return activityArray[i];
//        }
//      }
//      return null;
//    }
//
//    function updateActivity(activityArray, update, activityId) {
//      for (var i = 0; i < activityArray.length; i++) {
//        if (activityArray[i].id == activityId) {
//          activityArray[i] = update;
//        }
//      }
//      return activityArray;
//    }
//
//    function deleteActivity(activityArray, activityId) {
//      for (var i = 0; i < activityArray.length; i++) {
//        if (activityArray[i].id == activityId) {
//          activityArray.splice(i, 1);
//        }
//      }
//      return activityArray;
//    }
//
//    vm.loadBudget = function exportPDF() {
//      $location.path('/budget').search({ tripId: tripId });
//    }
//
//    vm.exportPDF = function exportPDF() {
//      TripService.exportPDF(tripId, function (result, response) {});
//    }
//
//    vm.triggerReminders = function triggerReminders() {
//      TripService.triggerReminders(tripId, function (result, response) {
//        if (result) {
//          alert('Email reminders were sent to ' + response.data.email + '!')
//        }
//
//      });
//    }
//
//
//    function onEventClick(activity, jsEvent, view) {
//      activity = getActivity($scope.eventSources[1], activity.id);
//      editActivity(jsEvent, activity, activity.id);
//    }
//
//    function onDayClick(date, jsEvent, view) {
//      // add 1 day to make up for off-by-one bug
//      editActivity(jsEvent, null, date);
//    }
//
//
//    /* Render Tooltip COPIED FROM CALENDAR DOCUMENTATION */
//    function eventRender(event, element, view) {
//      element.attr({ 'tooltip': event.title, 'tooltip-append-to-body': true });
//      $compile(element)($scope);
//    };
//
//    function eventDataTransform(events) {
//      // not currently used but could be useful ...
//      return events;
//    };
//
//    function updateCalendar(status, message) {
//      if (status) {
//        uiCalendarConfig.calendars.tripCalendar.fullCalendar('removeEvents');
//        $scope.eventSources[1] = message.data.data;
//        console.log($scope.eventSources)
//
//        uiCalendarConfig.calendars.tripCalendar.fullCalendar('addEventSource', $scope.eventSources[0]);
//        // uiCalendarConfig.calendars.tripCalendar.fullCalendar('addEventSource', $scope.eventSources[1]);
//      }
//    };
//
//    function updateTrip(status, message) {
//      if (status) {
//        vm.trip = message.data;
//      }
//    };
//
//    function editActivity(ev, activityIn, keyIn) {
//      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && vm.customFullscreen;
//      var activity = {};
//      var edit = false;
//      var start = undefined;
//      var end = undefined;
//
//      if (activityIn) {
//        angular.copy(activityIn, activity);
//        edit = true;
//      } else if (keyIn) {
//        start = keyIn;
//        end = keyIn;
//      }
//    }
//
//    vm.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
//
//    vm.popularActivities = function (ev) {
//      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && vm.customFullscreen;
//
//      $mdDialog.show({
//          controller: 'PopularDialogController',
//          controllerAs: 'dvm',
//          templateUrl: 'static/app/calendar/popular.template.html',
//          parent: angular.element(document.body),
//          targetEvent: ev,
//          clickOutsideToClose: true,
//          fullscreen: useFullScreen
//        })
//        .then(function (activity) {
//          editActivity(ev, activity);
//
//        }, function () {
//          console.log('You cancelled the dialog.');
//        });
//
//      $scope.$watch(function () {
//        return $mdMedia('xs') || $mdMedia('sm');
//      }, function (wantsFullScreen) {
//        vm.customFullscreen = (wantsFullScreen === true);
//      });
//    };

  }

})();
