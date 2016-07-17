(function() {
    'use strict';

    angular
        .module('travelcal.new-item')
        .controller('NewItemController', NewItemController);

    NewItemController.$inject = [
        '$http'
    ];

    function NewItemController($http) {
        var vm = this;
        vm.activity = {};

        vm.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        vm.periods =  [{
 			"close": {
 				"day": 0,
 				"time": "2300",
 				"hours": 23,
 				"minutes": 0,
 				"nextDate": 1468216800000
 			},
 			"open": {
 				"day": 0,
 				"time": "0700",
 				"hours": 7,
 				"minutes": 0,
 				"nextDate": 1468764000000
 			}
 		}, {
 			"close": {
 				"day": 1,
 				"time": "2300",
 				"hours": 23,
 				"minutes": 0,
 				"nextDate": 1468303200000
 			},
 			"open": {
 				"day": 1,
 				"time": "0700",
 				"hours": 7,
 				"minutes": 0,
 				"nextDate": 1468245600000
 			}
 		}, {
 			"close": {
 				"day": 2,
 				"time": "2300",
 				"hours": 23,
 				"minutes": 0,
 				"nextDate": 1468389600000
 			},
 			"open": {
 				"day": 2,
 				"time": "0700",
 				"hours": 7,
 				"minutes": 0,
 				"nextDate": 1468332000000
 			}
 		}, {
 			"close": {
 				"day": 3,
 				"time": "2300",
 				"hours": 23,
 				"minutes": 0,
 				"nextDate": 1468476000000
 			},
 			"open": {
 				"day": 3,
 				"time": "0700",
 				"hours": 7,
 				"minutes": 0,
 				"nextDate": 1468418400000
 			}
 		}, {
 			"close": {
 				"day": 4,
 				"time": "2300",
 				"hours": 23,
 				"minutes": 0,
 				"nextDate": 1468562400000
 			},
 			"open": {
 				"day": 4,
 				"time": "0700",
 				"hours": 7,
 				"minutes": 0,
 				"nextDate": 1468504800000
 			}
 		}, {
 			"close": {
 				"day": 5,
 				"time": "2300",
 				"hours": 23,
 				"minutes": 0,
 				"nextDate": 1468648800000
 			},
 			"open": {
 				"day": 5,
 				"time": "0700",
 				"hours": 7,
 				"minutes": 0,
 				"nextDate": 1468591200000
 			}
 		}, {
 			"close": {
 				"day": 6,
 				"time": "2300",
 				"hours": 23,
 				"minutes": 0,
 				"nextDate": 1468735200000
 			},
 			"open": {
 				"day": 6,
 				"time": "0700",
 				"hours": 7,
 				"minutes": 0,
 				"nextDate": 1468677600000
 			}
 		}];
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
    vm.result = [];
    vm.submit = function (activity) {
        if(activity.name) {
            vm.result.push(activity);
        }
    }
  }
})();
