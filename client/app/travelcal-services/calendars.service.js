(function () {
  'use strict';

  angular
    .module('travelcal')
    .factory('CalendarService', CalendarService);

  CalendarService.$inject = [
    '$http'
  ];

  function CalendarService($http, $localStorage) {
    var service = { };

    service.create = create;
    service.destroy = destroy;
    service.list = list;
    service.retrieve = retrieve;
    service.update = update;
    service.retrievePopular = retrievePopular;
    service.createActivityId = createActivityId;

    return service;

    function createActivityId(activity) {
        return activity.title + activity.start.toString();
    }

    function retrieve(calendarId, callback) {
      return $http.get('/api/v1/calendars/' + calendarId + '/')
      .then(function(res) {
        callback(true, res);
      }, function(res) {
        callback(false, res);
      })
    }
  
    function retrievePopular(callback) {
      return $http.get('/api/v1/calendars/popular/')
      .then(function(res) {
        callback(true, res);
      }, function(res) {
        callback(false, res);
      })
    }

    function list(callback) {
      return $http.get('/api/v1/calendars/')
      .then(function(res) {
        callback(true, res);
      }, function(res) {
        callback(false, res);
      })
    }

    function create(data, tripId, callback) {
      return $http.post('/api/v1/calendars/', {
        data: data,
        trip_id: tripId
      })
      .then(function(res) {
        callback(true, res);
      }, function(res) {
        callback(false, res);
      })
    }

    function update(calendarId, data, callback) {
      return $http.patch('/api/v1/calendars/' + calendarId + '/', { data: data })
      .then(function(res) {
        callback(true, res);
      }, function(res) {
        callback(false, res);
      })
    }

    function destroy(calendarId, callback) {
      return $http.delete('/api/v1/calendars/' + calendarId + '/')
      .then(function(res) {
        callback(true, res);
      }, function(res) {
        callback(false, res);
      })
    }

  }

})();
