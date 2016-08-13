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
    'ActivityService',
    'TripService'
  ];

  function TriplistController($http, $scope, $location, $mdDialog, $mdMedia, ActivityService, TripService) {
    var vm = this;
    vm.changeHighlighted = changeHighlighted;
    vm.deleteTrip = deleteTrip;
    vm.editTrip = editTrip;
    vm.loadTrip = loadTrip;
    vm.newTrip = newTrip;
    vm.showOptions = {};
    vm.trips = [];

    function changeHighlighted(index) {
      vm.showOptions = {};
      vm.showOptions[index] = true;
    }

    function deleteTrip(trip) {
      var confirm = $mdDialog.confirm()
        .title('Delete trip?')
        .ariaLabel('Delete trip ' + trip.name + '?')
        .targetEvent(event)
        .ok('YES')
        .cancel('CANCEL');

      $mdDialog.show(confirm).then(function() {
        TripService.destroy(trip.id)
          .then(function (response) {
            TripService.list(updateTrips);
          });
      }, function() {
        // on cancel do this ... 
      });
    }

    function editTrip(trip) {
      showDialog(trip);
    }

    function loadTrip(trip) {
      $location.path('/calendar').search({tripId: trip.id});
    }

    var updateTrips = function updateTrips(status, message) {
      if (status) {
        vm.trips = message.data;
      }
    };

    TripService.list(updateTrips);



    function newTrip(trip) {
      showDialog(null);
    }

    function showDialog(_trip) {
      var trip = angular.copy(_trip);
      if (trip) {
        trip.start_date = ActivityService.smartDate(new Date(trip.start_date), false);
        trip.end_date = ActivityService.smartDate(new Date(trip.end_date), false);
      }
      $scope.status = '  ';
      $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
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
          edit: false,
          activity: undefined,
          start: undefined,
          trip: trip 
        },
        parent: angular.element(document.body),
        clickOutsideToClose:true,
        fullscreen: useFullScreen
      })
        .then(function(answer) {
          $scope.tripStart = JSON.stringify(answer.start);
          $scope.tripStart = $scope.tripStart.slice(1,11);

          $scope.tripEnd = JSON.stringify(answer.end);
          $scope.tripEnd = $scope.tripEnd.slice(1,11);

          $scope.tripName = answer.name;
        
          if (answer.updating) {
            answer.start_date = moment(answer.start).toDate();
            answer.end_date = moment(answer.end).toDate();
            
            TripService.update(answer.id, answer, addTrip); 
          }
          else {
            TripService.create($scope.tripName, $scope.tripStart, $scope.tripEnd, addTrip);
          }

        }, function() {
          $scope.status = 'No trip was added.';
        });

        $scope.$watch(function() {
          return $mdMedia('xs') || $mdMedia('sm');
        }, function(wantsFullScreen) {
          $scope.customFullscreen = (wantsFullScreen === true);
        });
    }
  }
})();
