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
        var tripId = 13;
        if (tripId > -1) {
            $scope.eventSources = [];

            TripService.retrieve(tripId, function(result, response) {
                if (result) {
                    vm.trip = response.data;
                    vm.title = vm.trip.name;
                    vm.tripStart = new Date(vm.trip.start_date);
                    $scope.goToTripStart(vm.tripStart);
                    vm.tripEnd = new Date(vm.trip.end_date);
                    $scope.eventSources.push({color: '#f00', events: [{title: "TRIP START", start: vm.tripStart, allDay: true}, {title: "TRIP END", start: vm.tripEnd, allDay: true}]});
                    vm.calendar = response.data.calendar;
                    if (vm.calendar.data) {
                        $scope.events = [];
                        for (var i = 0; i < vm.calendar.data.length; i++) {
                            var newEvent = convertCalendarData(vm.calendar.data[i]);
                            if (newEvent != null) {
                                newEvent.position = i;
                                $scope.events.push(newEvent);
                            }
                        }
                        $scope.eventSources.push($scope.events);
                    }
                }
                else {
                    console.log("INVALID TRIP ID");
                }
            });

            $scope.onEventClick = function ( date, jsEvent, view ) {
                $scope.editActivity(jsEvent, vm.calendar.data[date.position], date.position);
            }

            $scope.onEventResize = function (event, delta, revertFunc, jsEvent, ui, view) {
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
                    var end = new Date(m.calendar.data[event.position].start);
                    var oldEndDate = end.getDate();
                    end.setDate(oldEndDate + delta_.days);
                    vm.calendar.data[event.position].end = end;
                }
                CalendarService.update(vm.calendar.id, vm.calendar.data, updateCalendar);
            }

            $scope.onEventDrop = function(event, delta, revertFunc, jsEvent, ui, view) {
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
                CalendarService.update(vm.calendar.id, vm.calendar.data, updateCalendar);

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
//                    defaultDate: "2015-03-25",
                    loading: $scope.goToTripStart,
                    eventRender: $scope.eventRender,
                    eventClick: $scope.onEventClick,
                    eventResize: $scope.onEventResize,
                    eventDrop: $scope.onEventDrop
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

        $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

        $scope.editActivity = function(ev, activityIn, keyIn) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
            var activity = {};
            var edit = false;
            if (activityIn) {
                angular.copy(activityIn, activity);
                edit = true;
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
                    activity: activity
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
                        console.log(vm.calendar.data);
                        vm.calendar.data = [];
                    }
                    if (keyIn != null) {
                        vm.calendar.data[keyIn] = activity;
                        $scope.eventSources[1][keyIn] = convertCalendarData(activity);
                    }
                    else {
                        console.log(vm.calendar);
                        vm.calendar.data.push(activity);
                        activity.position = vm.calendar.length;
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

