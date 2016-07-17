(function() {
    'use strict';

    angular
        .module('travelcal.new-item')
        .controller('NewItemController', NewItemController);

    NewItemController.$inject = [
        '$http'
    ];

    function NewItemController($http, $setPristine) {
        var vm = this;
        vm.activity = {};
        vm.newItemForm = {};
        vm.activity.currency = '';

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

        vm.currencies =  [{value: 'usd', display: 'usd'}, {value: 'ddk', display: 'dkk'}, {value: 'eur', display: 'eur'}];

        vm.newCurrency = function newCurrency(currency) {
            alert("Sorry, that currency is not supported.")
        }

        vm.querySearch = function querySearch (query) {
            return query ? vm.currencies.filter( createFilterFor(query) ) : vm.currencies;
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

        vm.result = [];
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
