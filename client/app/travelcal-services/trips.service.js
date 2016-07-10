(function () {
  'use strict';

  angular
    .module('travelcal')
    .factory('TripService', TripService);

  TripService.$inject = [
    '$http'
  ];

  function TripService($http, $localStorage) {
    var service = { };

    service.retrieve = retrieve;
    service.create = create;
    service.destroy = destroy;
    service.update = update;

    return service;

    function retrieve(tripId, callback) {
      return $http.get('/api/v1/trips/' + tripId + '/')
      .then(function(res) {
        callback(true, res);
      }, function(res) {
        callback(false, res);
      })
    }

    function create(name, startDate, endDate, callback) {
      return $http.post('/api/v1/trips/', {
        name: name,
        start_date: startDate,
        end_date: endDate
      })
      .then(function(res) {
        callback(true, res);
      }, function(res) {
        callback(false, res);
      })
    }

    function update(tripId, data, callback) {
      return $http.patch('/api/v1/trips/' + tripId + '/', data)
      .then(function(res) {
        callback(true, res);
      }, function(res) {
        callback(false, res);
      })
    }

    function destroy(tripId, callback) {
      return $http.delete('/api/v1/trips/' + tripId + '/')
      .then(function(res) {
        callback(true, res);
      }, function(res) {
        callback(false, res);
      })
    }

  }

})();
