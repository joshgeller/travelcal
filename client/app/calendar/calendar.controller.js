(function() {
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
    'moment'
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
    moment
  )
  {

    var vm = this;
    vm.customFullscreen;
    vm.events = [];
    vm.eventSources = [];
    vm.uiConfig = {};

    // 'private' members
    var tripId;

    // 'private' functions
    var convertCalendarData = convertCalendarData;
    var getMoment = getMoment;
    var editActivity = editActivity;
    var eventRender = eventRender;
    var eventDataTransform = eventDataTransform;
    var goToTripStart = goToTripStart;
    var init = init;
    var onDayClick = onDayClick;
    var onEventClick = onEventClick;
    var onEventDrop = onEventDrop;
    var onEventResize = onEventResize;
    var updateCalendar =  updateCalendar;
    var updateTrip = updateTrip;
    var updateActivity = updateActivity;
    var deleteActivity = deleteActivity;
    var getActivity = getActivity;



    init();

    function convertCalendarData(event) {
      if (event.hasOwnProperty("start") && event.start != null) {
        event.start = new moment(event.start);
      }
      if (event.hasOwnProperty("end") && event.end != null) {
        event.end  = new moment(event.end);
      }
      if (event.start) {
        return event;
      }
    }

    function getActivity(activityArray, activityId) {
        for (var i = 0; i < activityArray.length; i++) {
            if (activityArray[i].id == activityId) {
                return activityArray[i];
            }
        }
        return null;
    }


    function updateActivity(activityArray, update, activityId) {
      for (var i = 0; i < activityArray.length; i++) {
        if (activityArray[i].id == activityId) {
          activityArray[i] = update;
          return activityArray;
          activityArray.splice(i, 1);
        }
      }
      
      return activityArray;
    }

    function deleteActivity(activityArray, activityId) {
        for (var i = 0; i < activityArray.length; i++) {
            if (activityArray[i].id == activityId) {
                activityArray.splice(i, 1);
                return activityArray;
            }
        }
        return activityArray;
    }

    function getMoment(date) {
      return (date instanceof moment) ? date : new moment(date);
    }

    function init() {
      tripId = $location.search().tripId || -1;
      vm.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

      /* config object BASED ON CODE FROM CALENDAR DOCUMENTATION */
      vm.uiConfig = {
        calendar:{
          height: 450,
          editable: true,
          header:{
            left: 'title',
            center: '',
            right: 'today prev,next'
          },
          loading: goToTripStart,
          eventRender: eventRender,
          eventDataTransform: eventDataTransform,
          eventClick: onEventClick,
          eventResize: onEventResize,
          eventDrop: onEventDrop,
          dayClick: onDayClick
        }
      };

      if (tripId > -1) {
        TripService.retrieve(tripId, function(result, response) {
          if (result) {
            vm.trip = response.data;
            vm.title = vm.trip.name;
            goToTripStart(vm.trip.start_date);
            var dateRange = {
              color: '#f00',
              events: [
                {title: "TRIP START", start: vm.trip.start_date, class: 'trip_start', allDay: true},
                {title: "TRIP END", start: vm.trip.end_date, class: 'trip_end', allDay: true}
              ]
            };
            vm.eventSources.push(dateRange);
            vm.calendar_id = response.data.id;
            if (!response.data.calendar.data) {
              response.data.calendar.data = [];
            }
            vm.eventSources.push(response.data.calendar.data);
          }
          else {
            console.log("INVALID TRIP ID");
          }
        });
      }
    }
    vm.loadBudget = function exportPDF() {
      $location.path('/budget').search({tripId:tripId});
    }

    vm.exportPDF = function exportPDF() {
      TripService.exportPDF(tripId, function(result, response) {});
    }

    vm.triggerReminders = function triggerReminders() {
      TripService.triggerReminders(tripId, function(result, response) {
        if (result) {
          alert('Email reminders were sent to ' + response.data.email + '!')
        }

      });
    }

    function onEventClick(activity, jsEvent, view ) {
      activity = getActivity(vm.calendar.data, activity.id);
      editActivity(jsEvent, activity, activity.id);
    }

    function onEventResize(event, delta, revertFunc, jsEEvent, ui, view) {
      if (event.class != 'trip_start' && event.class != 'trip_end') {
        var activity = getActivity(vm.eventSources[1], event.id);
        if (activity) {
            if (activity.end) {
              activity.end = moment(activity.end);
              activity.end.add(delta._days, 'd');
            }
            else {
              activity.end = moment(activity.start);
              activity.end.add(delta._days, 'd');
            }
            vm.eventSources[1] = updateActivity(vm.eventSources[1], activity, activity.id);
            CalendarService.update(vm.calendar_id, vm.eventSources[1], updateCalendar);
        }
      }
    }

    function onEventDrop(event, delta, revertFunc, jsEvent, ui, view) {
      if (event.class == 'trip_start') {
        vm.trip.start_date = moment(vm.trip.start_date);
        vm.trip.start_date.add(delta._days, 'd');
        TripService.update(vm.trip.id, vm.trip, updateTrip);

      }
      else if (event.class == 'trip_end') {
        vm.trip.end_date = moment(vm.trip.end_date);
        vm.trip.end_date.add(delta._days, 'd');
        TripService.update(vm.trip.id, vm.trip, updateTrip);
      }
      else {
        var activity = getActivity(vm.eventSources[1], event.id);
        if (activity.start) {
          activity.start = moment(activity.start);
          activity.start.add(delta._days, 'd');
        }
        if (activity.end) {
          activity.end = moment(activity.end);
          activity.end.add(delta._days, 'd');
        }
        else {
          activity.end = moment(activity.start);
          activity.end.add(delta._days, 'd');
        }
        vm.eventSources[1] = updateActivity(vm.eventSources[1], activity, activity.id);
        CalendarService.update(vm.calendar_id, vm.eventSources[1], updateTrip);
      }
    }

    function onDayClick(date, jsEvent, view) {
      // add 1 day to make up for off-by-one bug
      editActivity(jsEvent, null, date.add(1, 'd').toDate());
    }

    // Take the calendar to the appropriate month for the trip
    function goToTripStart(startDate) {
      uiCalendarConfig.calendars.tripCalendar.fullCalendar('gotoDate', startDate);
    }



    /* Render Tooltip COPIED FROM CALENDAR DOCUMENTATION */
    function eventRender( event, element, view ) {
      element.attr({'tooltip': event.title, 'tooltip-append-to-body': true});
      $compile(element)($scope);
    };

    function eventDataTransform(events) {
      // not currently used but could be useful ... 
      return events;
    };


    function updateCalendar(status, message) {
      if (status) {
        vm.eventSources[1] = message.data.data;
      }
    };

    function updateTrip(status, message) {
      if (status) {
        vm.trip = message.data;
      }
    };

    function editActivity(ev, activityIn, keyIn) {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && vm.customFullscreen;
      var activity = {};
      var edit = false;
      var start = undefined;
  
      if (activityIn) {
        angular.copy(activityIn, activity);
        edit = true;
      }
      else if (keyIn) {
        start = keyIn;
      }

      $mdDialog.show({
        controller: 'DialogController',
        controllerAs: 'dvm',
        templateUrl: 'static/app/new-item/new-item.template.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: useFullScreen,
        locals: {
          edit: edit,
          activity: activity,
          start: start
        }
      })
        .then(function(activity) {
          // Delete Activity
          if (typeof activity == 'boolean' && activity == true) {
            if (keyIn) {
              vm.eventSources[1] = deleteActivity(vm.eventSources[1], keyIn);
            }
          }
          else {
            var start = moment(activity.start) || undefined
            if (activity.startTime) {
              var time = moment(activity.startTime)
              var hour = time.hours()
              var min = time.minutes()
              start.hour(hour)
              start.minute(min)
            }
            activity.start = start
            var end = moment(activity.end) || undefined
            if (activity.endTime) {
              var time = moment(activity.endTime)
              var hour = time.hours()
              var min = time.minutes()
              end.hour(hour)
              end.minute(min)
            }
            activity.end = end
            if (!activity.quantity){
              activity.quantity = 1;
            }
            if (vm.eventSources[1] == null) {
              vm.eventSources[1] = [];
            }
            // Update activity
            if (typeof keyIn == 'string' && keyIn != null) {
              vm.eventSources[1] = updateActivity(vm.eventSources[1], activity, activity.id);
            }
            // New activity
            else {
              console.log(vm.eventSources[1]);
              activity.id = CalendarService.createActivityId(activity);
              vm.eventSources[1].push(activity);
            }
          }
          CalendarService.update(vm.calendar_id, vm.eventSources[1], updateCalendar);
  
          // @TODO
          // force reloading page after making changes -- need to find out why calendar isn't
          // updating when eventSurces or calendar.data changes
          $window.location.reload();
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });

        $scope.$watch(function() {
          return $mdMedia('xs') || $mdMedia('sm');
        }, function(wantsFullScreen) {
          vm.customFullscreen = (wantsFullScreen === true);
        });
    };

    vm.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

    vm.popularActivities = function (ev) {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && vm.customFullscreen;

      $mdDialog.show({
        controller: 'PopularDialogController',
        controllerAs: 'dvm',
        templateUrl: 'static/app/calendar/popular.template.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: useFullScreen
      })
        .then(function(activity) {
            editActivity(ev, activity);

        }, function() {
          console.log('You cancelled the dialog.');
        });

        $scope.$watch(function() {
          return $mdMedia('xs') || $mdMedia('sm');
        }, function(wantsFullScreen) {
          vm.customFullscreen = (wantsFullScreen === true);
        });
    };

  }

})();
