(function() {
  'use strict';

  angular
    .module('travelcal.triplist')
    .controller('TriplistController', TriplistController);

  TriplistController.$inject = [
    '$http',
    '$scope',
    '$location',
    '$mdDialog',
    '$mdMedia',
    'TripService'
  ];

  function TriplistController($http, $scope, $location, $mdDialog, $mdMedia, TripService) {
    var vm = this;
    vm.loadTrip = loadTrip;
    vm.trips = [];

    function loadTrip(trip) {
      $location.path('/budget').search({tripId: trip.id});
    }

    var updateTrips = function updateTrips(status, message) {
      if (status) {
        vm.trips = message.data;
      }
    };
    TripService.list(updateTrips);

    $scope.status = '  ';
    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');


    $scope.newTrip = function(ev) {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

      var addTrip = function addTrip(status, message) {
        if (status) {
          TripService.list(updateTrips);
        }
      };

      $mdDialog.show({
        controller: 'DialogController',
        controllerAs: 'dvm',
        templateUrl: 'static/app/triplist/new-trip.template.html',
        locals: {
          edit: true,
          activity: undefined,
          start: undefined
        },
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: useFullScreen
      })
        .then(function(answer) {
          $scope.tripStart = JSON.stringify(answer.start);
          $scope.tripStart = $scope.tripStart.slice(1,11);

          $scope.tripEnd = JSON.stringify(answer.end);
          $scope.tripEnd = $scope.tripEnd.slice(1,11);

          $scope.tripName = answer.name;

          TripService.create($scope.tripName, $scope.tripStart, $scope.tripEnd, addTrip);

        }, function() {
          $scope.status = 'No trip was added.';
        });

        $scope.$watch(function() {
          return $mdMedia('xs') || $mdMedia('sm');
        }, function(wantsFullScreen) {
          $scope.customFullscreen = (wantsFullScreen === true);
        });
    };
  }
})();


