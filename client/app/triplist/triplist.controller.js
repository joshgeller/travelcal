(function() {
  'use strict';

  angular
    .module('travelcal.triplist')
    .controller('TriplistController', TriplistController);

  TriplistController.$inject = [
    '$http',
    '$scope',
    '$mdDialog',
    '$mdMedia'
  ];

  function TriplistController($http, $scope, $mdDialog, $mdMedia) {
    var vm = this;
    vm.trips = [{country: 'Denmark', arrive: '9/28/2016', depart: '10/10/2016'},
                {country: 'Spain', arrive: '6/2/2017', depart: '6/15/2017'},
                {country: 'Australia', arrive: '12/28/2017', depart: '1/20/2018'}]


  $scope.status = '  ';
  $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');


  $scope.newTrip = function(ev) {
    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'new-trip.template.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:false,
      fullscreen: useFullScreen
    })
    .then(function(answer) {
        $scope.status = 'New Trip:"' + answer + '".';
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


