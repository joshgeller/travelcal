(function() {
  'use strict';

  angular
    .module('travelcal.triplist')
    .controller('TriplistController', TriplistController);

  TriplistController.$inject = [
    '$http'
  ];

  function TriplistController($http) {
    var vm = this;
    vm.trips = [{country: 'Denmark', arrive: '9/28/2016', depart: '10/10/2016'},
                {country: 'Spain', arrive: '6/2/2017', depart: '6/15/2017'},
                {country: 'Australia', arrive: '12/28/2017', depart: '1/20/2018'}]
//    vm.register = function () {
//      return $http.post('/api/v1/accounts/', {
//        password: vm.password,
//        email: vm.email
//      });
//    }
  }

})();
