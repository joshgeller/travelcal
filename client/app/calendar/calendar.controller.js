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
        'CalendarService'
    ];

    function CalendarController($scope, $mdDialog, $mdMedia, $compile, uiCalendarConfig, $location, TripService, CalendarService) {
        var vm = this;

//       var  tripId = $location.search().tripId || -1;
        var tripId = 11;
        if (tripId > -1) {
            $scope.eventSources = [];

            TripService.retrieve(tripId, function(result, response) {
                if (result) {
                    vm.trip = response.data;
                    vm.title = vm.trip.name;
                    vm.tripStart = new Date(vm.trip.start_date);
                    $scope.goToTripStart(vm.tripStart);
                    vm.tripEnd = new Date(vm.trip.end_date);
                    var dateRange = {
                        color: '#f00',
                        events: [
                            {title: "TRIP START", start: vm.tripStart, class: 'start', allDay: true},
                            {title: "TRIP END", start: vm.tripEnd, class: 'end', allDay: true}
                        ]
                    };
                    $scope.eventSources.push(dateRange);
                    vm.calendar = response.data.calendar;
                    $scope.events = [];
                    if (vm.calendar.data) {
                        for (var i = 0; i < vm.calendar.data.length; i++) {
                            var newEvent = convertCalendarData(vm.calendar.data[i]);
                            if (newEvent != null) {
                                newEvent.position = i;
                                $scope.events.push(newEvent);
                            }
                        }
                    }
                    $scope.eventSources.push($scope.events);
                }
                else {
                    console.log("INVALID TRIP ID");
                }
            });

            $scope.onEventClick = function ( date, jsEvent, view ) {
                $scope.editActivity(jsEvent, vm.calendar.data[date.position], date.position);
            }

            $scope.onEventResize = function (event, delta, revertFunc, jsEvent, ui, view) {
                if (event.class != 'start' && event.class != 'end') {
                    if (vm.calendar.data[event.position].end) {
                        if (vm.calendar.data[event.position].end instanceof Date) {
                            end = vm.calendar.data[event.position].end;
                        }
                        else {
                            end = new Date(vm.calendar.data[event.position].end);
                        }
                        var oldEndDate = end.getDate();
                        end.setDate(oldEndDate + delta._days);
                        vm.calendar.data[event.position].end = end;
                    }
                    else {
                        var end;
                        if (vm.calendar.data[event.position].start instanceof Date) {
                            end = vm.calendar.data[event.position].start;
                        }
                        else {
                            end = new Date(vm.calendar.data[event.position].start);
                        }
                        var oldEndDate = end.getDate();
                        end.setDate(oldEndDate + delta._days);
                        vm.calendar.data[event.position].end = end;
                    }
                    CalendarService.update(vm.calendar.id, vm.calendar.data, updateCalendar);

                }
            }

            $scope.onEventDrop = function(event, delta, revertFunc, jsEvent, ui, view) {
                if (event.class == 'start') {
                    var start;
                    if (vm.trip.start_date instanceof Date) {
                        start = vm.trip.start_date;
                    }
                    else {
                        start = new Date(vm.trip.start_date);
                    }
                    var oldStartDate = start.getDate();
                    start.setDate(oldStartDate + delta._days);
                    start = JSON.stringify(start);
                    vm.trip.start_date = start.slice(1,11);
//                    TripService.update(vm.trip.id, vm.trip, updateTrip);

                }
                else if (event.class = 'end') {
                    var end;
                    if (vm.trip.end_date instanceof Date) {
                        end = vm.trip.end_date;
                    }
                    else {
                        end = new Date(vm.trip.end_date);
                    }
                    var oldEndDate = end.getDate();
                    end.setDate(oldEndDate + delta._days);
                    end = JSON.stringify(end);
                    vm.trip.end_date = end.slice(1,11);
//                    TripService.update(vm.trip.id, vm.trip, updateTrip);
                }
                else {
                    if (vm.calendar.data[event.position].start) {
                        var start;
                        if (vm.calendar.data[event.position].start instanceof Date) {
                            start = vm.calendar.data[event.position].start;
                        }
                        else {
                            start = new Date(vm.calendar.data[event.position].start);
                        }
                        var oldStartDate = start.getDate();
                        start.setDate(oldStartDate + delta._days);
                        vm.calendar.data[event.position].start = start;
                    }
                    if (vm.calendar.data[event.position].end) {
                        var end;
                        if (vm.calendar.data[event.position].end instanceof Date) {
                            end = vm.calendar.data[event.position].end;
                        }
                        else {
                            end = new Date(vm.calendar.data[event.position].end);
                        }
                        var oldEndDate = end.getDate();
                        end.setDate(oldEndDate + delta._days);
                        vm.calendar.data[event.position].end = end;
                    }
                    else {
                        var end;
                        if (vm.calendar.data[event.position].start instanceof Date) {
                            end = vm.calendar.data[event.position].start;
                        }
                        else {
                            end = new Date(vm.calendar.data[event.position].start);
                        }
                        var oldEndDate = end.getDate();
                        end.setDate(oldEndDate + delta._days);
                        vm.calendar.data[event.position].end = end;
                    }
                    CalendarService.update(vm.calendar.id, vm.calendar.data, updateTrip);

                }
            }

            $scope.onDayClick = function(date, jsEvent, view) {
                $scope.editActivity(jsEvent, null, date._d);
            }

            // Take the calendar to the appropriate month for the trip
            $scope.goToTripStart = function(startDate) {
                uiCalendarConfig.calendars.tripCalendar.fullCalendar('gotoDate', startDate);
            }


            /* config object BASED ON CODE FROM CALENDAR DOCUMENTATION */
            $scope.uiConfig = {
                calendar:{
                    height: 450,
                    editable: true,
                    header:{
                        left: 'title',
                        center: '',
                        right: 'today prev,next'
                    },
                    loading: $scope.goToTripStart,
                    eventRender: $scope.eventRender,
                    eventClick: $scope.onEventClick,
                    eventResize: $scope.onEventResize,
                    eventDrop: $scope.onEventDrop,
                    dayClick: $scope.onDayClick
                }
            };

             /* Render Tooltip COPIED FROM CALENDAR DOCUMENTATION */
            $scope.eventRender = function( event, element, view ) {
                element.attr({'tooltip': event.title, 'tooltip-append-to-body': true});
                $compile(element)($scope);
            };

        }

        var updateCalendar = function updateCalendar(status, message) {
            if (status) {
                vm.calendar.data = message.data.data;
            }
        };

        var updateTrip = function updateTrip(status, message) {
            if (status) {
                vm.trip = message.data;
            }
        };

        $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

        $scope.editActivity = function(ev, activityIn, keyIn) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
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
                controller: DialogController,
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

                if (typeof activity == 'boolean' && activity == true) {
                    if (keyIn > -1) {
                        vm.calendar.data.splice(keyIn, 1);
                    }
                }
                else {

                    if (!activity.quantity){
                        activity.quantity = 1;
                    }
                    if (vm.calendar.data == null) {
                        vm.calendar.data = [];
                    }
                    if (keyIn != null && typeof keyIn == 'integer') {
                        vm.calendar.data[keyIn] = activity;
                        $scope.eventSources[1][keyIn] = convertCalendarData(activity);
                    }
                    else {
                        vm.calendar.data.push(activity);
                        activity.position = vm.calendar.length - 1;
                        $scope.eventSources[1].push(convertCalendarData(activity));
                    }
                }
                CalendarService.update(vm.calendar.id, vm.calendar.data, updateCalendar);

            }, function() {
                $scope.status = 'You cancelled the dialog.';
            });

            $scope.$watch(function() {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function(wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        };


    }

})();

function convertCalendarData(event) {

    if (event.hasOwnProperty("start") && event.start != null) {
        event.start = new Date(event.start);
    }
    if (event.hasOwnProperty("end") && event.end != null) {
        event.end  = new Date(event.end);
    }
    if (event.start) {
        return event;
    }
}

