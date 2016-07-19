(function() {
  'use strict';

  angular
    .module('travelcal.triplist')
    .controller('TriplistController', TriplistController);

  TriplistController.$inject = [
    '$http',
    '$scope',
    '$mdDialog',
    '$mdMedia',
    'TripService'
  ];

  function TriplistController($http, $scope, $mdDialog, $mdMedia, TripService) {
    var vm = this;
    vm.trips = [{country: 'Denmark', arrive: '9/28/2016', depart: '10/10/2016'},
                {country: 'Spain', arrive: '6/2/2017', depart: '6/15/2017'},
                {country: 'Australia', arrive: '12/28/2017', depart: '1/20/2018'}]


  $scope.status = '  ';
  $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');


  $scope.newTrip = function(ev) {
    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

    var trips = function updateTrips(status, message) {
        console.log(message)
    }

    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'new-trip.template.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:false,
      fullscreen: useFullScreen
    })
    .then(function(answer) {
        $scope.tripStart = JSON.stringify(answer.start);
        $scope.tripStart = $scope.tripStart.slice(1,11);
        $scope.tripEnd = JSON.stringify(answer.end);
        $scope.tripEnd = $scope.tripEnd.slice(1,11);
        $scope.tripName = answer.name;
        console.log($scope.tripStart);
        console.log($scope.tripEnd);



      TripService.create($scope.tripName, $scope.tripStart, $scope.tripEnd, trips);

    }, function() {
        $scope.status = 'You cancelled the dialog.';
    });

    $scope.$watch(function() {
      return $mdMedia('xs') || $mdMedia('sm');
    }, function(wantsFullScreen) {
      $scope.customFullscreen = (wantsFullScreen === true);
    });

  };

  }

  function DialogController($scope, $mdDialog) {
//  $scope.NewItemController = NewItemController;
  $scope.hide = function() {
    $mdDialog.hide();
  };

  $scope.cancel = function() {
    $mdDialog.cancel();
  };

  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };
}


})();


