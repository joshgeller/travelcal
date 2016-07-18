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
    vm.activity;

      vm.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      vm.selected = [];
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
//      vm.currencies =  [{value: 'usd', display: 'usd'}, {value: 'ddk', display: 'dkk'}, {value: 'eur', display: 'eur'}];

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
      vm.result = [];
      vm.submit = function (activity) {
        if(activity.name) {
          vm.result.push(activity.name);
          activity.name = '';
        }
      }

  }

})();
