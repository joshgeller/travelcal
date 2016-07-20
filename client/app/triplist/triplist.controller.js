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

                TripService.create($scope.tripName, $scope.tripStart, $scope.tripEnd, addTrip);

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


