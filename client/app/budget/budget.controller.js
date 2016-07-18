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
            alert("error");
        })
    }

    function getCurrencies() {
        return $http({
            method:'Get',
            url:'http://api.fixer.io/latest'
        }).success(function(data) {
            return data;
        }).error(function() {
            alert("error");
        })
    }
  }

  BudgetController.$inject = [
    '$http',
    '$location',
    'CurrencyService'
  ];




  function BudgetController($http, $location, CurrencyService) {
    var vm = this;
    vm.currencies = null;
    vm.baseCurrency = "USD";
    vm.total = 0;
    vm.budget = [
             {  "id": 1234,
                "name": "Modern Art Museum",
                "cost": 25,
                "currency": "AUD",
                "days": {
                    "Monday": {
                        "start": null,
                        "end": null,
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
                "start": "2016-07-17T07:00:00.000Z",
                "end": "2016-07-10T07:00:00.000Z",
                "url": "http://www.moma.org",
                "quantity": 2,
                "notes": "Recommended"
            },
            {  "id": 1111,
                "name": "AirBnB",
                "cost": 117,
                "currency": "CAD",
                "start": "2016-07-17T07:00:00.000Z",
                "end": "2016-07-18T07:00:00.000Z",
                "quantity": 1,
            },
            {  "id": 2222,
                "name": "Taxi",
                "cost": 25,
                "currency": "DKK",
                "start": "2016-07-19T07:00:00.000Z",
                "end": "2016-07-19T07:00:00.000Z",
                "quantity": 1,
            }
          ];

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
//            vm.baseCurrency = vm.currencyAutoComplete["USD"].value;
            console.log(vm.currencyAutoComplete);
        }, function error(response) {
            console.log(response);
    });

    vm.updateCurrency = function updateCurrency(newBase){
        if (newBase) {
            CurrencyService.getRates(newBase)
                .then(function success(response) {
                    console.log(newBase);
                    vm.baseCurrency = newBase;
                    vm.currencies = response.data;
                    vm.total = 0;
                    for (var item in vm.budget) {
                        if (vm.budget[item].currency == vm.baseCurrency) {
                            vm.total += vm.budget[item].cost * vm.budget[item].quantity;
                        }
                        else {
                            vm.total += vm.budget[item].cost * vm.budget[item].quantity * vm.currencies.rates[vm.budget[item].currency];
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
  }

})();
