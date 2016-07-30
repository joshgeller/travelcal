(function() {
    'use strict';

    angular
        .module('travelcal.budget')
        .controller('BudgetController', BudgetController)
        .service('CurrencyService', CurrencyService);


    function CurrencyService($http) {
        delete $http.defaults.headers.common['X-Requested-With'];
        var service = {};
        service.getRates = getRates;
        service.getCurrencies = getCurrencies;
        return service;

        function getRates(base) {
            return $http({
                method:'Get',
                url:'http://api.fixer.io/latest?base=' + base
            }).success(function(data) {
                return data;
            }).error(function(response) {
                console.log(response);
                return response;
            })
        }

        function getCurrencies() {
            return $http({
                method:'Get',
                url:'http://api.fixer.io/latest'
            }).success(function(data) {
                return data;
            }).error(function(response) {
                console.log(response);
                return response;
            })
        }
    }

    BudgetController.$inject = [
        '$scope',
        '$mdDialog',
        '$mdMedia',
        '$http',
        '$location',
        'CurrencyService',
        'TripService',
        'CalendarService'
    ];


    function BudgetController($scope, $mdDialog, $mdMedia, $http, $location, CurrencyService, TripService, CalendarService) {
        var vm = this;
        var  tripId = $location.search().tripId || -1;
        vm.currencies = null;
        vm.baseCurrency = "USD";
        vm.total = 0;
        vm.calendar = {};

        vm.editActivity = editActivity;
        vm.loadCalendar = loadCalendar;

        function loadCalendar() {
          $location.path('/calendar');
        }

        if (tripId > -1) {
            TripService.retrieve(tripId, function(result, response) {
                if (result) {
                    vm.trip = response.data;
                    vm.calendar = response.data.calendar;
                    if (!vm.calendar.data) {
                        vm.calendar.data = [];
                    }
//                    else {
//                        vm.total = (function() {
//                            for (var i = 0; i < vm.calendar.data.length; i++) {
//                                vm.total += vm.calendar.data[i].cost;
//                            }
//                        })();
//                    }
                }
                else {
                    console.log("INVALID TRIP ID");
                }
            })
            .then(CurrencyService.getCurrencies()
            .then(function success(response) {
                vm.currencies = response.data;
                vm.currencyNames = Object.getOwnPropertyNames(vm.currencies.rates);
                vm.currencyNames.push(response.data.base);
                vm.currencyNames.sort();
                vm.currencyAutoComplete = [];
                for (var i = 0; i < vm.currencyNames.length; i++) {
                    var newCurrency = {value:vm.currencyNames[i], display:vm.currencyNames[i]};
                    vm.currencyAutoComplete.push(newCurrency);
                    if (newCurrency.value == "USD") {
                        vm.updateCurrency(newCurrency.value);
                    }
                }
            }, function error(response) {
                console.log(response);
            }));
        }

        vm.updateCurrency = function updateCurrency(newBase){
            if (newBase) {
                CurrencyService.getRates(newBase)
                    .then(function success(response) {
                        vm.baseCurrency = newBase;
                        vm.currencies = response.data;
                        vm.total = 0;
                        for (var item in vm.calendar.data) {
                            if (vm.calendar.data[item].currency == vm.baseCurrency) {
                                vm.total += vm.calendar.data[item].cost * vm.calendar.data[item].quantity;
                            }
                            else {
                                vm.total += vm.calendar.data[item].cost * vm.calendar.data[item].quantity / vm.currencies.rates[vm.calendar.data[item].currency];
                            }
                        }
                    }, function error(response) {
                        console.log(response);
                    });
            }
        }

        vm.newCurrency = function newCurrency(currency) {
            alert("Sorry, that currency is not supported.")
        }

        vm.querySearch = function querySearch (query) {
            return query ? vm.currencyAutoComplete.filter( createFilterFor(query) ) : vm.currencyAutoComplete;
        }

        function createFilterFor(query) {
            var uppercaseQuery = angular.uppercase(query);
            return function filterFn(currency) {
                return (currency.value.indexOf(uppercaseQuery) === 0);
            }
        }

        var updateCalendar = function updateCalendar(status, message) {
            if (status) {
                vm.calendar.data = message.data.data;
            }
        };

        vm.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

        function editActivity(ev, activityIn, keyIn) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && vm.customFullscreen;
            var activity = {};
            var edit = false;
            if (activityIn) {
                angular.copy(activityIn, activity);
                edit = true;
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
                    start: undefined
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
                            vm.updateCurrency(vm.baseCurrency);
                        }
                        else {
                            vm.calendar.data.push(activity);
                            vm.updateCurrency(vm.baseCurrency);
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
