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
    var getDateObject = getDateObject;
    var editActivity = editActivity;
    var eventRender = eventRender;
    var goToTripStart = goToTripStart;
    var init = init;
    var onDayClick = onDayClick;
    var onEventClick = onEventClick;
    var onEventDrop = onEventDrop;
    var onEventResize = onEventResize;
    var updateCalendar =  updateCalendar;
    var updateTrip = updateTrip;

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

    function getDateObject(date) {
      return (date instanceof Date) ? date : new Date(date);
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
                {title: "TRIP START", start: vm.tripStart, class: 'start', allDay: true},
                {title: "TRIP END", start: vm.tripEnd, class: 'end', allDay: true}
              ]
            };
            vm.eventSources.push(dateRange);
            vm.calendar = response.data.calendar;
            if (vm.calendar.data) {
              for (var i = 0; i < vm.calendar.data.length; i++) {
                var newEvent = convertCalendarData(vm.calendar.data[i]);
                if (newEvent != null) {
                  console.log(newEvent);
                  newEvent.position = i;
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
      editActivity(jsEvent, vm.calendar.data[activity.position], activity.position);
    }

    function onEventResize(event, delta, revertFunc, jsEvent, ui, view) {
      if (event.class != 'start' && event.class != 'end') {
        if (vm.calendar.data[event.position].end) {
          var end = getDateObject(vm.calendar.data[event.position].end);
          end.setDate(end.getDate() + delta._days);
          vm.calendar.data[event.position].end = end;
        }
        else {
          var end = getDateObject(vm.calendar.data[event.position].start);
          end.setDate(end.getDate() + delta._days);
          vm.calendar.data[event.position].end = end;
        }
        CalendarService.update(vm.calendar.id, vm.calendar.data, updateCalendar);

      }
    }

    function onEventDrop(event, delta, revertFunc, jsEvent, ui, view) {
      if (event.class == 'start') {
        var start = getDateObject(vm.trip.start_date);
        start.setDate(start.getDate() + delta._days);
        start = JSON.stringify(start);
        vm.trip.start_date = start.slice(1,11);
        TripService.update(vm.trip.id, vm.trip, updateTrip);

      }
      else if (event.class = 'end') {
        var end = getDateObject(vm.trip.end_date);
        end.setDate(end.getDate() + delta._days);
        end = JSON.stringify(end);
        vm.trip.end_date = end.slice(1,11);
        TripService.update(vm.trip.id, vm.trip, updateTrip);
      }
      else {
        if (vm.calendar.data[event.position].start) {
          var start = getDateObject(vm.calendar.data[event.position].start);
          start.setDate(start.getDate() + delta._days);
          vm.calendar.data[event.position].start = start;
        }
        if (vm.calendar.data[event.position].end) {
          var end = getDateObject(vm.calendar.data[event.position].end);
          end.setDate(end.getDate() + delta._days);
          vm.calendar.data[event.position].end = end;
        }
        else {
          var end = getDateObject(vm.calendar.data[event.position].start);
          end.setDate(end.getDate() + delta._days);
          vm.calendar.data[event.position].end = end;
        }
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
            console.log(activity);
          if (typeof activity == 'boolean' && activity == true) {
            if (keyIn > -1) {
              vm.calendar.data.splice(keyIn, 1);
              vm.eventSources[1].splice(keyIn, 1);
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
            if (keyIn != null && typeof keyIn == 'integer') {
              vm.calendar.data[keyIn] = activity;
              vm.eventSources[1][keyIn] = convertCalendarData(activity);
            }
            else {
              vm.calendar.data.push(activity);
              activity.position = vm.calendar.data.length - 1;
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
