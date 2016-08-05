(function() {
    'use strict';

    angular
        .module('travelcal.popular')
        .controller('PopularController', PopularController);

    PopularController.$inject = [
        '$mdDialog',
        '$mdMedia',
        '$scope'
    ];

    function PopularController($mdDialog, $mdMedia, $scope) {
        var vm = this;
        vm.trip = {};
        vm.trip.name = "New York"
        vm.popular_activities = [{"title": "Central Park", "address": {
                                    "address_components": [{
                                        "long_name": "11",
                                        "short_name": "11",
                                        "types": ["street_number"]
                                    }, {
                                        "long_name": "West 53rd Street",
                                        "short_name": "W 53rd St",
                                        "types": ["route"]
                                    }, {
                                        "long_name": "Midtown",
                                        "short_name": "Midtown",
                                        "types": ["neighborhood", "political"]
                                    }, {
                                        "long_name": "Manhattan",
                                        "short_name": "Manhattan",
                                        "types": ["sublocality_level_1", "sublocality", "political"]
                                    }, {
                                        "long_name": "New York",
                                        "short_name": "New York",
                                        "types": ["locality", "political"]
                                    }, {
                                        "long_name": "New York County",
                                        "short_name": "New York County",
                                        "types": ["administrative_area_level_2", "political"]
                                    }, {
                                        "long_name": "New York",
                                        "short_name": "NY",
                                        "types": ["administrative_area_level_1", "political"]
                                    }, {
                                        "long_name": "United States",
                                        "short_name": "US",
                                        "types": ["country", "political"]
                                    }, {
                                        "long_name": "10019",
                                        "short_name": "10019",
                                        "types": ["postal_code"]
                                    }],
                                    "adr_address": "<span class=\"street-address\">11 W 53rd St</span>, <span class=\"locality\">New York</span>, <span class=\"region\">NY</span> <span class=\"postal-code\">10019</span>, <span class=\"country-name\">USA</span>",
                                    "formatted_address": "11 W 53rd St, New York, NY 10019, USA",
                                    "formatted_phone_number": "(212) 708-9400",
                                } , "popularityScore": 100},
                                {"title": "Modern Art Museum", "address": {"formatted_address": "123 Main St, New York, NY 10019, USA"}, "popularityScore": 50},
                                {"title": "Forest Park", "address": {"formatted_address": "11194 NW Germantown Rd, Portland, OR 97229, USA"}, "popularityScore": 99}]


        vm.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

        $scope.addToTrip = function (activity, event) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && vm.customFullscreen;
            var edit = true;

            $mdDialog.show({
                controller: 'DialogController',
                controllerAs: 'dvm',
                templateUrl: 'static/app/new-item/new-item.template.html',
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose:true,
                fullscreen: useFullScreen,
                locals: {
                    edit: edit,
                    activity: activity,
                    start: undefined
                }
            })
            .then(function(activity) {

                if (!activity.quantity){
                    activity.quantity = 1;
                }
                if (vm.calendar.data == null) {
                    vm.calendar.data = {};
                }
                if (keyIn != null) {
                    vm.calendar.data[keyIn] = activity;
                    vm.updateCurrency(vm.baseCurrency);
                }
                else {
                    vm.calendar.data.push(activity);
                    vm.updateCurrency(vm.baseCurrency);
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

        }
    }
})();
