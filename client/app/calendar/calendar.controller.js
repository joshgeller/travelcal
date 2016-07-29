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
        var tripId = 9;
        if (tripId > -1) {
            $scope.eventSources = [];

            TripService.retrieve(tripId, function(result, response) {
                if (result) {
                    vm.trip = response.data;
                    vm.title = vm.trip.name;
                    vm.tripStart = new Date(vm.trip.start_date);
                    vm.tripEnd = new Date(vm.trip.end_date);
                    $scope.eventSources.push({color: '#f00', events: [{title: "TRIP START", start: vm.tripStart}, {title: "TRIP END", start: vm.tripEnd}]});
                    vm.calendar = response.data.calendar;
                    if (vm.calendar.data) {
                        $scope.events = convertCalendarData(vm.calendar.data);
                        $scope.eventSources.push($scope.events);
                        console.log($scope.eventSources);
                    }
                }
                else {
                    console.log("INVALID TRIP ID");
                }
            });

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
                    eventRender: $scope.eventRender
                }
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
                        vm.calendar.data = {};
                    }
                    if (keyIn != null) {
                        vm.calendar.data[keyIn] = activity;
                        $scope.eventSources.events[keyIn] = convertCalendarData([activity])[0];
                    }
                    else {
                        vm.calendar.data.push(activity);
                        $scope.eventSources[1].push(convertCalendarData([activity])[0]);
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

function convertCalendarData(events) {
    formattedEvents = [];

    for (var i = 0; i < events.length; i++) {
        if (events[i].hasOwnProperty("start") && events[i].start != null) {
            events[i].start = new Date(events[i].start);
        }
        if (events[i].hasOwnProperty("end") && events[i].end != null) {
            events[i].end  = new Date(events[i].end);
        }
        if (events[i].start) {
            formattedEvents.push(events[i]);
        }

    }

    return formattedEvents;
}

