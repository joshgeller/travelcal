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
        var edit = true;
        vm.newItemForm = {};
        vm.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        vm.selected = [];

        if (edit) {
            vm.title = "Edit Activity"
            vm.activity = {
                "name": "Modern Art Museum",
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
                "start": "2016-07-17T07:00:00.000Z",
                "end": "2016-07-10T07:00:00.000Z",
                "url": "moma.org",
                "quantity": 2,
                "notes": "Recommended"
            };
            vm.activity.start = new Date(vm.activity.start);
            vm.activity.end = new Date(vm.activity.end);
            vm.activity.days.Monday.start = new Date(vm.activity.days.Monday.start);
            vm.activity.days.Monday.end = new Date(vm.activity.days.Monday.end);
            var days = Object.getOwnPropertyNames(vm.activity.days);
            vm.result = days;
            days.forEach(function(value, index, array) {
                if (vm.activity.days[value].open) {
                    vm.selected.push(value);
                }
            });
        }
        else {
            vm.title = "New Activity"
            vm.activity = {};
            vm.activity.currency = '';
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

//        vm.result = [];
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
