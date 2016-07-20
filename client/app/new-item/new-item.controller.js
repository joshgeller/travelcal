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
        vm.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
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
            vm.activity.startsAt = new Date(vm.activity.startsAt);
            vm.activity.endsAt = new Date(vm.activity.endsAt);
            if (vm.activity.days) {
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
            }
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
          // Not being used if the item is added via the budget
//        vm.submit = function () {
//            vm.activity = {};
//            vm.NewItemForm.$setPristine();
//        }
    }
})();
