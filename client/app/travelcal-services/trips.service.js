(function () {
  'use strict';

  angular
    .module('travelcal')
    .factory('TripService', TripService);

  TripService.$inject = [
    'CalendarService',
    '$http',
    '$localStorage'
  ];

  function TripService(CalendarService, $http, $localStorage) {
    var service = { };

    service.create = create;
    service.destroy = destroy;
    service.list = list;
    service.retrieve = retrieve;
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

    function list(callback) {
      return $http.get('/api/v1/trips/')
      .then(function(res) {
        callback(true, res);
      }, function(res) {
        callback(false, res);
      })
    }

    function create(name, startDate, endDate, callback) {
      $http.post('/api/v1/trips/', {
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
