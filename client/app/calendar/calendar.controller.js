(function() {
  'use strict';

  angular
    .module('travelcal.calendar')
    .controller('CalendarController', CalendarController);

  CalendarController.$inject = [
    '$scope',
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
            vm.tripStart = new moment(vm.trip.start_date);
            goToTripStart(vm.tripStart);
            vm.tripEnd = new moment(vm.trip.end_date);
            var dateRange = {
              color: '#f00',
              events: [
                {title: "TRIP START", start: vm.tripStart, class: 'trip_start', allDay: true},
                {title: "TRIP END", start: vm.tripEnd, class: 'trip_end', allDay: true}
              ]
            };
            vm.eventSources.push(dateRange);
            vm.calendar = response.data.calendar;
            if (vm.calendar.data) {
              for (var i = 0; i < vm.calendar.data.length; i++) {
                var newEvent = convertCalendarData(vm.calendar.data[i]);
                if (newEvent != null) {
                  vm.events.push(newEvent);
                }
              }
            }
            vm.eventSources.push(vm.events);
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
        var activity = getActivity(vm.calendar.data, event.id);
        if (activity) {
            if (activity.end) {
              var end = getMoment(activity.end);
              end.add(delta._days, 'd');
              activity.end = end;
              activity.end_date = end
            }
            else {
              var end = getMoment(activity.start);
              end.add(delta._days, 'd');
              activity.end = end;
            }
            vm.calendar.data = updateActivity(vm.calendar.data, activity, activity.id);
            CalendarService.update(vm.calendar.id, vm.calendar.data, updateCalendar);
        }
      }
    }

    function onEventDrop(event, delta, revertFunc, jsEvent, ui, view) {
      if (event.class == 'trip_start') {
        var start = getMoment(vm.trip.start_date);
        start.add(delta._days, 'd');
        vm.trip.start_date = start;
        TripService.update(vm.trip.id, vm.trip, updateTrip);

      }
      else if (event.class == 'trip_end') {
        var end = getMoment(vm.trip.end_date);
        end.add(delta._days, 'd');
        vm.trip.end_date = end;
        TripService.update(vm.trip.id, vm.trip, updateTrip);
      }
      else {
        var activity = getActivity(vm.calendar.data, event.id);
        if (activity.start) {
          var start = getMoment(activity.start);
          start.add(delta._days, 'd');
          activity.start = start;
        }
        if (activity.end) {
          var end = getMoment(activity.end);
          end.add(delta._days, 'd');
          activity.end = end;
        }
        else {
          var end = getMoment(activity.start);
          end.setDate(end.getDate() + delta._days);
          activity.end = end;
        }
        vm.calendar.data = updateActivity(vm.calendar.data, activity, activity.id);
        CalendarService.update(vm.calendar.id, vm.calendar.data, updateTrip);
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
    };


    function updateCalendar(status, message) {
      if (status) {
        vm.calendar.data = message.data.data;
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
              vm.calendar.data = deleteActivity(vm.calendar.data, keyIn);
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
            if (vm.calendar.data == null) {
              vm.calendar.data = [];
            }
            // Update activity
            if (typeof keyIn == 'string' && keyIn != null) {
              vm.calendar.data = updateActivity(vm.calendar.data, activity, activity.id);
              vm.eventSources[1] = updateActivity(vm.eventSources[1], activity, activity.id);
            }
            // New activity
            else {
              activity.id = CalendarService.createActivityId(activity);
              vm.calendar.data.push(activity);
              vm.eventSources[1].push(convertCalendarData(activity));
            }
          }
          CalendarService.update(vm.calendar.id, vm.calendar.data, updateCalendar);
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });

        $scope.$watch(function() {
          return $mdMedia('xs') || $mdMedia('sm');
        }, function(wantsFullScreen) {
          vm.customFullscreen = (wantsFullScreen === true);
        });
    };
  }

})();
