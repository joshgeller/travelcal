(function() {
  'use strict';

  angular
    .module('travelcal.budget')
    .controller('BudgetController', BudgetController);

  BudgetController.$inject = [
    '$http'
  ];

  function BudgetController($http) {
    var vm = this;
    vm.budget = [{name: 'Art Museum', start: '9/28/2016', end: '9/28/2016', reps: 1, cost: 7.00, currency: 'usd'},
                     {name: 'AirBnB', start: '9/28/2016', end: '10/10/2016', reps: 12, cost: 67.00, currency: 'usd', url: 'https://www.airbnb.com/rooms/2518456'},
                     {name: 'Taxi', start: '9/29/2016', end: '10/1/2016', reps: 3, cost: 25.00, currency: 'usd'}]
    vm.total = 0;
//    vm.register = function () {
//      return $http.post('/api/v1/accounts/', {
//        password: vm.password,
//        email: vm.email
//      });
//    }
  }

})();
