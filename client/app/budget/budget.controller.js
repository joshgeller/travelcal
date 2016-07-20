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
            }).error(function() {
                console.log("error");
            })
        }

        function getCurrencies() {
            return $http({
                method:'Get',
                url:'http://api.fixer.io/latest'
            }).success(function(data) {
                return data;
            }).error(function() {
                console.log("error");
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
        vm.currencies = null;
        vm.baseCurrency = "USD";
        vm.total = 0;
        vm.calendar = {};
        vm.calendar.data = {};
        vm.trips;

        var getTrips = function getTrips(status, message) {
            if(status) {
                vm.trip = message.data[0];
                vm.calendar = vm.trip.calendar;
            }
        }
        TripService.list(getTrips);


        CurrencyService.getCurrencies()
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
        });

        vm.updateCurrency = function updateCurrency(newBase){
            if (newBase) {
                CurrencyService.getRates(newBase)
                    .then(function success(response) {
                        vm.baseCurrency = newBase;
                        vm.currencies = response.data;
                        vm.total = 0;
                        for (var item in vm.budget) {
                            if (vm.budget[item].currency == vm.baseCurrency) {
                                vm.total += vm.budget[item].cost * vm.budget[item].quantity;
                            }
                            else {
                                vm.total += vm.budget[item].cost * vm.budget[item].quantity / vm.currencies.rates[vm.budget[item].currency];
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
                console.log(message);
            }
        };

        $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
        $scope.editActivity = function(ev, activityIn) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
            var activity = {};
            var edit = false;
            if (activityIn) {
                activity = activityIn;
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
                console.log(vm.calendar);
                if (vm.calendar.data == null) {
                    vm.calendar.data = {};
                }
                vm.calendar.data[0] = activity;
                console.log(vm.calendar.data);

                CalendarService.update(vm.calendar.id, vm.calendar.data, updateCalendar);

                var listCalendar = function listCalendar(status, message) {
                    if (status) {
                        console.log(message);
                    }
                };
                CalendarService.retrieve(vm.calendar.id, listCalendar);

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


DialogController.$inject = [
    '$mdDialog',
    'locals'
]

function DialogController($mdDialog, locals) {
    var vm = this;
    vm.edit = locals.edit;
    vm.activity = locals.activity;
    vm.hide = function() {
        $mdDialog.hide();
    };

    vm.cancel = function() {
        $mdDialog.cancel();
    };

    vm.add = function(activity) {
        $mdDialog.hide(activity);
    };
    vm.update = function(activity) {
        $mdDialog.hide(activity);
    };
}