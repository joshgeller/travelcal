(function() {
    'use strict';

    angular
        .module('travelcal.new-item')
        .controller('NewItemController', NewItemController);

  NewItemController.$inject = [
    '$http',
    'CurrencyService'
  ];

  function NewItemController($http, CurrencyService) {
    var vm = this;
    var edit = false;
    vm.newItemForm = {};
    vm.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    vm.selected = [];
    vm.currency = '';

        if (edit) {
            vm.title = "Edit Activity";
            vm.activity = {
                "title": "Modern Art Museum",
                "cost": 25,
                "currency": "usd",
                "days": {
                    "Monday": {
                        "start": "1970-01-01T08:32:00.000Z",
                        "end": "1970-01-01T08:32:00.000Z",
                        "open": true
                    },
                    "Tuesday": {
                        "start": null,
                        "end": null,
                        "open": true
                    },
                    "Wednesday": {
                        "start": null,
                        "end": null,
                        "open": true
                    },
                    "Thursday": {
                        "start": null,
                        "end": null,
                        "open": true
                    },
                    "Friday": {
                        "start": null,
                        "end": null,
                        "open": true
                    },
                    "Saturday": {
                        "start": null,
                        "end": null
                    },
                    "Sunday": {
                        "start": null,
                        "end": null
                    }
                },
                "startsAt": "2016-07-17T07:00:00.000Z",
                "endsAt": "2016-07-17T07:00:00.000Z",
                "url": "moma.org",
                "quantity": 2,
                "notes": "Recommended"
            };
            vm.activity.startsAt = new Date(vm.activity.startsAt);
            vm.activity.endsAt = new Date(vm.activity.endsAt);
            var days = Object.getOwnPropertyNames(vm.activity.days);
            days.forEach(function(value, index, array) {
                if (vm.activity.days[value].start) {
                    vm.activity.days[value].start = new Date(vm.activity.days[value].start);
                }
                if (vm.activity.days[value].end) {
                    vm.activity.days[value].end = new Date(vm.activity.days[value].end);
                }
                if (vm.activity.days[value].open) {
                    vm.selected.push(value);
                }
            });
            vm.currency = vm.activity.currency;
        }
        else {
            vm.title = "New Activity"
            vm.activity = {};
        }

        vm.toggle = function (item, list) {
            var idx = list.indexOf(item);
            if (idx > -1) {
                list.splice(idx, 1);
            }
            else {
                list.push(item);
            }
        };
        vm.exists = function (item, list) {
            return list.indexOf(item) > -1;
        }

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
            }
        }, function error(response) {
            console.log(response);
    });

        vm.repetitionTypes = ['total', 'per person', 'per day'];


        vm.newCurrency = function newCurrency(currency) {
            alert("Sorry, that currency is not supported.")
        }
      vm.querySearch = function querySearch (query) {
        return query ? vm.currencyAutoComplete.filter( createFilterFor(query) ) : vm.currencyAutoComplete;
      }

        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(currency) {
                return (currency.value.indexOf(lowercaseQuery) === 0);
            }
        }

        vm.updateCurrency = function updateCurrency (currentCurrency) {
            vm.activity.currency = currentCurrency;
            return;
        }

        vm.submit = function () {
            var response = $http.post('/SOMETHING', vm.activity)
    //        response.success(function(data, status, headers, config) {
    //            alert(data);
    //        });
    //        response.error(function(data, status, headers, config) {
    //            alert("ERROR: " + JSON.stringify({data: data}));
    //        });
//            vm.result.push(vm.activity);
    //        alert(vm.activity.name);
            vm.activity = {};
            vm.NewItemForm.$setPristine();
        }
    }
})();
