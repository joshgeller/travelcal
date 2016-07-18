(function() {
  'use strict';

  angular
    .module('travelcal.budget')
    .controller('BudgetController', BudgetController)
    .service('CurrencyService', CurrencyService);


  function CurrencyService($http) {
    delete $http.defaults.headers.common['X-Requested-With'];
    this.getData = function(callbackFunc) {
        return $http({
            method:'GET',
            url: 'http://api.fixer.io/latest?base=USD'
        }).success(function(data) {
            callbackFunc(data);
        }).error(function() {
//             TODO fix this
            alert("error");
        });
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
    vm.baseCurr = "USD";
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
              ]
    CurrencyService.getData(function(dataResponse) {
        vm.currencies = dataResponse;
        vm.currencyNames = Object.getOwnPropertyNames(vm.currencies.rates).sort();
        vm.currencyAutoComplete = [];
        for (var i = 0; i < vm.currencyNames.length; i++) {
            console.log(vm.currencyNames[i])
            var newCurrency = {value:vm.currencyNames[i], display:vm.currencyNames[i]};
            vm.currencyAutoComplete.push(newCurrency);
        }
        for (var item in vm.budget) {
            vm.total += vm.budget[item].cost * vm.budget[item].quantity * vm.currencies.rates[vm.budget[item].currency];
        }
    })
//        vm.currencies =  [{value: 'usd', display: 'usd'}, {value: 'ddk', display: 'dkk'}, {value: 'eur', display: 'eur'}];

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

  }

})();
