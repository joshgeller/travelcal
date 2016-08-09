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
    var service = {};

    service.create = create;
    service.destroy = destroy;
    service.list = list;
    service.retrieve = retrieve;
    service.update = update;
    service.exportPDF = exportPDF;
    service.triggerReminders = triggerReminders;

    return service;

    function retrieve(tripId, callback) {
      return $http.get('/api/v1/trips/' + tripId + '/')
        .then(function (res) {
          callback(true, res);
        }, function (res) {
          callback(false, res);
        })
    }

    function exportPDF(tripId, callback) {
      return $http.get('/api/v1/trips/' + tripId + '/pdf/', {
          responseType: 'arraybuffer'
        })
        .success(function (response) {
          var file = new Blob([response], { type: 'application/pdf' });
          var fileURL = URL.createObjectURL(file);
          window.open(fileURL, '_blank');
        })
        .then(function (res) {
          callback(true, res);
        }, function (res) {
          callback(false, res);
        })
    }

    function triggerReminders(tripId, callback) {
      return $http.get('/api/v1/trips/' + tripId + '/remind/')
        .then(function (res) {
          callback(true, res);
        }, function (res) {
          callback(false, res);
        })
    }

    function list(callback) {
      return $http.get('/api/v1/trips/')
        .then(function (res) {
          callback(true, res);
        }, function (res) {
          callback(false, res);
        })
    }

    function create(name, startDate, endDate, callback) {
      $http.post('/api/v1/trips/', {
          name: name,
          start_date: startDate,
          end_date: endDate
        })
        .then(function (res) {
          callback(true, res);
        }, function (res) {
          callback(false, res);
        })
    }

    function update(tripId, data, callback) {
       var _data = {};

       _data.name = data.name;
       _data.start_date = formatDate(data.start_date) || data.start_date;
       _data.end_date = formatDate(data.end_date) || data.end_date;

      return $http.patch('/api/v1/trips/' + tripId + '/', _data)
        .then(function(res) {
          callback(true, res);
        }, function(res) {
          callback(false, res);
      })
    }

    function destroy(tripId, callback) {
      return $http.delete('/api/v1/trips/' + tripId + '/')
        .then(function(res) {
          if (callback) {
            callback(true, res);
          }
          else {
            return res;
          }
        }, function(res) {
          if (callback) {
            callback(false, res);
          }
          else {
            return res;
          }
      })
    }


    function formatDate(value) {
      return JSON.stringify(value).slice(1,11);
    }
  }

})();
