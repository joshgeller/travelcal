(function() {
    'use strict';

    angular
        .module('travelcal.new-item')
        .controller('NewItemController', NewItemController);

    NewItemController.$inject = [
        '$http',
        '$scope',
        'CurrencyService'
    ];

    function NewItemController($http, $scope, CurrencyService) {
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
            vm.title = "Edit Activity";
            vm.activity.start = new Date(vm.activity.start) || undefined;
            vm.activity.end = new Date(vm.activity.end) || undefined;
            vm.activity.startTime = new Date(vm.activity.startTime) || undefined;
            vm.activity.endTime = new Date(vm.activity.endTime) || undefined;
            vm.currency = vm.activity.currency;
        }
        else {
            vm.title = "New Activity"
            vm.activity = {};
            vm.activity.quantity = 1;
            vm.activity.repetitionType = "total";
            vm.activity.allDay = true;
            console.log($scope.$parent.dvm)
            if ($scope.$parent.dvm.start) {
                vm.activity.start = $scope.$parent.dvm.start;
                vm.activity.end = $scope.$parent.dvm.start;
            }
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
        vm.updateCurrency = function updateCurrency (currentCurrency) {
            vm.activity.currency = currentCurrency;
            return;
        }
    }
})();
