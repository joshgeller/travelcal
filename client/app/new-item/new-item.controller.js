(function () {
  'use strict';

  angular
    .module('travelcal.new-item')
    .controller('NewItemController', NewItemController);

  NewItemController.$inject = [
    '$http',
    '$scope',
    'CurrencyService',
    'moment'
  ];

  function NewItemController($http, $scope, CurrencyService, moment) {
    var vm = this;

    vm.newItemForm = {};
    vm.repetitionTypes = ['total', 'per person', 'per day'];
    vm.selected = [];
    vm.currency = '';

    if ($scope.$parent.dvm.edit) {
      vm.edit = $scope.$parent.dvm.edit;
    }
    if ($scope.$parent.dvm.activity) {
      vm.activity = $scope.$parent.dvm.activity;
    }
    if (vm.edit) {
      var start = moment(vm.activity.start) || undefined
      if (vm.activity.startTime) {
        var time = vm.activity.startTime.split('T')[1];
        var hour = time.split(':')[0];
        var min = time.split(':')[1]
        start.hour(hour)
        start.minute(min)
      }
      var end = moment(vm.activity.end) || undefined
      if (vm.activity.endTime) {
        var time = vm.activity.endTime.split('T')[1];
        var hour = time.split(':')[0];
        var min = time.split(':')[1]
        end.hour(hour)
        end.minute(min)
      }
      vm.title = "Edit Activity";
      vm.activity.start = start.toDate()
      vm.activity.end = end.toDate()
      vm.activity.startTime = moment(vm.activity.startTime).toDate() || undefined;
      vm.activity.endTime = moment(vm.activity.endTime).toDate() || undefined;
      vm.currency = vm.activity.currency;
    } else {
      vm.title = "New Activity"
      vm.activity = {};
      vm.activity.quantity = 1;
      vm.activity.repetitionType = "total";
      vm.activity.allDay = true;
      if ($scope.$parent.dvm.start) {
        vm.activity.start = moment($scope.$parent.dvm.start).toDate();
        vm.activity.end = moment($scope.$parent.dvm.start).toDate();
      }
    }

    vm.toggle = function (item, list) {
      var idx = list.indexOf(item);
      if (idx > -1) {
        list.splice(idx, 1);
      } else {
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
          var newCurrency = { value: vm.currencyNames[i], display: vm.currencyNames[i] };
          vm.currencyAutoComplete.push(newCurrency);
        }
      }, function error(response) {
        console.log(response);
      });

    vm.newCurrency = function newCurrency(currency) {
      alert("Sorry, that currency is not supported.")
    }
    vm.querySearch = function querySearch(query) {
      return query ? vm.currencyAutoComplete.filter(createFilterFor(query)) : vm.currencyAutoComplete;
    }

    function createFilterFor(query) {
      var uppercaseQuery = angular.uppercase(query);
      return function filterFn(currency) {
        return (currency.value.indexOf(uppercaseQuery) === 0);
      }
    }
    vm.updateCurrency = function updateCurrency(currentCurrency) {
      vm.activity.currency = currentCurrency;
      return;
    }
  }
})();
