(function() {
    'use strict';

    angular
        .module('travelcal.calendar')
        .controller('CalendarController', CalendarController);

    CalendarController.$inject = [
        '$scope',
        '$location',
        'TripService',
        'CalendarService',
        '$compile',
        'uiCalendarConfig'
    ];

    function CalendarController($scope, $location, TripService, CalendarService, $compile, uiCalendarConfig) {
        var vm = this;

//       var  tripId = $location.search().tripId || -1;
        var tripId = 9;
        if (tripId > -1) {
            $scope.eventSources = [];


            TripService.retrieve(tripId, function(result, response) {
                if (result) {
                    vm.trip = response.data;
                    vm.title = vm.trip.name;
                    console.log(vm.trip);
                    vm.calendar = response.data.calendar;
                    if (vm.calendar.data) {
                        $scope.events = convertCalendarData(vm.calendar.data);
                        console.log($scope.events);
                    }
                    else {
                        $scope.events = [];
                    }
                    $scope.eventSources.push($scope.events);
                }
                else {
                    console.log("INVALID TRIP ID");
                }
            });


            /* alert on eventClick */
            $scope.alertOnEventClick = function( date, jsEvent, view){
                $scope.alertMessage = (date.title + ' was clicked ');
            };
            /* alert on Drop */
             $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
               $scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
            };
            /* alert on Resize */
            $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view ){
               $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
            };
            /* add and removes an event source of choice */
            $scope.addRemoveEventSource = function(sources,source) {
              var canAdd = 0;
              angular.forEach(sources,function(value, key){
                if(sources[key] === source){
                  sources.splice(key,1);
                  canAdd = 1;
                }
              });
              if(canAdd === 0){
                sources.push(source);
              }
            };
            /* add custom event*/
            $scope.addEvent = function() {
              $scope.events.push({
                title: 'Open Sesame',
                start: new Date(y, m, 28),
                end: new Date(y, m, 29),
                className: ['openSesame']
              });
            };
            /* remove event */
            $scope.remove = function(index) {
              $scope.events.splice(index,1);
            };
            /* Change View */
            $scope.changeView = function(view,calendar) {
              uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
            };
            /* Change View */
            $scope.renderCalender = function(calendar) {
              if(uiCalendarConfig.calendars[calendar]){
                uiCalendarConfig.calendars[calendar].fullCalendar('render');
              }
            };
             /* Render Tooltip */
            $scope.eventRender = function( event, element, view ) {
                element.attr({'tooltip': event.title,
                             'tooltip-append-to-body': true});
                $compile(element)($scope);
            };
            /* config object */
            $scope.uiConfig = {
              calendar:{
                height: 450,
                editable: true,
                header:{
                  left: 'title',
                  center: '',
                  right: 'today prev,next'
                },
                eventClick: $scope.alertOnEventClick,
                eventDrop: $scope.alertOnDrop,
                eventResize: $scope.alertOnResize,
                eventRender: $scope.eventRender
              }
            };
        }

    }

})();

function convertCalendarData(events) {
    formattedEvents = [];

    for (var i = 0; i < events.length; i++) {
        events[i].start = new Date(events[i].startsAt);
        events[i].end  = new Date(events[i].endsAt);
        formattedEvents.push(events[i]);
    }

    return formattedEvents;
}

