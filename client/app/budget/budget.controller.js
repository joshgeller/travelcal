(function() {
    'use strict';

    angular
        .module('travelcal.budget')
        .controller('BudgetController', BudgetController)
        .service('CurrencyService', CurrencyService);


    function CurrencyService(
        $http
    ) {
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
        'CalendarService',
        'ActivityService'
    ];


    function BudgetController(
        $scope,
        $mdDialog,
        $mdMedia,
        $http,
        $location,
        CurrencyService,
        TripService,
        CalendarService,
        ActivityService
    ) {

        var vm = this;
        var tripId = $location.search().tripId || -1;
        vm.currencies = null;
        vm.baseCurrency = "USD";
        vm.total = 0;
        vm.calendar = {};
        vm.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

        vm.editActivity = editActivity;
        vm.newActivity = newActivity;
        vm.loadCalendar = loadCalendar;
        vm.showBudgetToolBar = showBudgetToolBar;
        vm.showToolBar = showToolBar;
        vm.popularActivities = popularActivities;

        // Currency functions
        vm.updateCurrency = updateCurrency;
        vm.newCurrency = newCurrency;
        vm.querySearch = querySearch;

        init();

        function init() {
            if (tripId > -1) {
                TripService.retrieve(tripId, function(result, response) {
                    if (result) {
                        vm.trip = response.data;
                        vm.calendar = response.data.calendar;
                        if (!vm.calendar.data) {
                            vm.calendar.data = [];
                        }
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
        }

        function showToolBar(data) {
          for (var key in data) {
            if (!data[key].cost) {
              return true;
            }
          }
          return false;
        }

        function showBudgetToolBar(data) {
          for (var key in data) {
            if (data[key].cost) {
              return true;
            }
          }
          return false;
        }

        function loadCalendar() {
          $location.path('/calendar');
        }

        function updateCurrency(newBase){
            if (newBase) {
                CurrencyService.getRates(newBase)
                    .then(function success(response) {
                        vm.baseCurrency = newBase;
                        vm.currencies = response.data;
                        vm.total = 0;
                        for (var item in vm.calendar.data) {
                            if (vm.calendar.data[item].cost && vm.calendar.data[item].currency == vm.baseCurrency) {
                                vm.total += vm.calendar.data[item].cost * vm.calendar.data[item].quantity;
                            }
                            else if (vm.calendar.data[item].cost) {
                                vm.total += vm.calendar.data[item].cost * vm.calendar.data[item].quantity / vm.currencies.rates[vm.calendar.data[item].currency];
                            }
                        }
                    }, function error(response) {
                        console.log(response);
                    });
            }
        }

        function newCurrency(currency) {
            alert("Sorry, that currency is not supported.")
        }

        function querySearch (query) {
            return query ? vm.currencyAutoComplete.filter( createFilterFor(query) ) : vm.currencyAutoComplete;
        }

        function createFilterFor(query) {
            var uppercaseQuery = angular.uppercase(query);
            return function filterFn(currency) {
                return (currency.value.indexOf(uppercaseQuery) === 0);
            }
        }

        function updateCalendar(status, data) {
            if (status) {
              vm.calendar.data = data;
              updateTotal();
            }
        };

        function updateTotal() {
          var _total = 0;
          var data = vm.calendar.data;

          for (var key in data) {
            if (data[key].cost) {
              _total += data[key].cost;
            }
          }
          vm.total = _total;
        }

        function editActivity($event, activityIn, idx) {
            var _startDate = moment.utc(activityIn.start, 'YYYY-MM-DD').format();
            var _endDate = moment.utc(activityIn.end, 'YYYY-MM-DD').format();
            var _activity = angular.copy(activityIn);
            var idx;

            _activity.start = _startDate;
            _activity.end = _endDate;
            console.log(_activity);

            ActivityService.editActivityForm(_activity)
              .then(function (result) {
                if (result.GOOD) {
                  if (result.data.source) {
                    delete result.data.source;
                  }

                  // activity
                  if (idx >= 0) {
                    vm.calendar.data.splice(idx, 1);
                    if (!result.DELETE) {
                        vm.calendar.data.push(result.data);
                    }
                  }
                  else if (!idx) {
                    vm.calendar.data.push(result.data);
                  }

                  CalendarService.update(vm.calendar.id, vm.calendar.data)
                    .then(function(success) {
                      updateCalendar(true, vm.calendar.data);
                      console.log("Calendar updated");
                    }, function (error) {
                      console.log("Error updating calendar.");
                    });
                }
              });
        }

        function newActivity() {
            // Default to the first day of the trip
            var _startDate = moment.utc(vm.trip.start_date, 'YYYY-MM-DD').format();
            ActivityService.createActivityForm(_startDate, _startDate)
              .then(function(result) {
                if (result.GOOD) {
                  if (result.DELETE) {
                    return;
                  }
                  vm.calendar.data.push(result.data);
                  CalendarService.update(vm.calendar.id, vm.calendar.data)
                    .then(function(success) {
                      updateCalendar(true, vm.calendar.data);
                      console.log("Activity added to calendar");
                    }, function (error) {
                      console.log("Error updating calendar.");
                    });
                }
              })
        }

        function popularActivities(ev) {
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
