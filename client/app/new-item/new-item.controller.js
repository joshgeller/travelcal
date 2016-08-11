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

    vm.formIsValid = formIsValid;

    function formIsValid(form) {
      if (form) {
        return form.$valid;
      }
      return false;
    }

    if ($scope.$parent.dvm.edit) {
      vm.edit = $scope.$parent.dvm.edit;
    }
    if ($scope.$parent.dvm.activity) {
      vm.activity = $scope.$parent.dvm.activity;
    }
    if (vm.edit) {
      vm.activity.startTime = moment(vm.activity.startTime).toDate()
      vm.activity.endTime = moment(vm.activity.endTime).toDate()
      vm.activity.start = moment(vm.activity.start) || undefined;
      vm.activity.end = moment(vm.activity.end) || undefined;

      if (vm.activity.startTime) {
        var time = moment(vm.activity.startTime)
        var hour = time.hours()
        var min = time.minutes()
        vm.activity.start.hour(hour)
        vm.activity.start.minute(min)
      }
      if (vm.activity.endTime) {
        var time = moment(vm.activity.endTime)
        var hour = time.hours()
        var min = time.minutes()
        vm.activity.end.hour(hour)
        vm.activity.end.minute(min)
      }

      vm.title = 'Edit Activity';
      vm.currency = vm.activity.currency;

    } else {

      vm.title = 'Add a New Activity'
      vm.activity = {};
      vm.activity.allDay = true;
      vm.activity.quantity = 1;
      vm.activity.repetitionType = 'total';
      vm.currency = 'USD';      // default currency
      vm.endTime = undefined;
      vm.startTime = undefined;
      if ($scope.$parent.dvm.start) {
        // Start/end dates are passed from calendar controller as Moments
        // so we convert them here for the datepicker, which wants native Dates
        vm.activity.start = $scope.$parent.dvm.start;
        vm.activity.end = $scope.$parent.dvm.start;
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
      alert('Sorry, that currency is not supported.')
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

    vm.renderStart = function() {
      if (!moment.isMoment(vm.activity.start)) {
        vm.activity.start = moment(vm.activity.start)
      }
      return vm.activity.start.utc().format('MMMM Do, YYYY')
    }
  }
})();
