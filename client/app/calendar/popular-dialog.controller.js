(function() {
  'use strict';

  angular
    .module('travelcal.calendar')
    .controller('PopularDialogController', PopularDialogController);

  PopularDialogController.$inject = [
    '$mdDialog'
  ];

  function PopularDialogController($mdDialog) {
    var vm = this;
    init();

    function init() {
      // get activity list?
    };

    function hide() {
      console.log('hiding');
      $mdDialog.hide();
    };

    function addActivity(answer) {
        console.log(answer);
        $mdDialog.hide(answer);
    };

    function cancel() {
      console.log('canceling');
      $mdDialog.cancel();
    };

  }
})();

//        vm.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
//        $scope.addToTrip = function (activity, event) {
//            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && vm.customFullscreen;
//            var edit = true;
//
//            $mdDialog.show({
//                controller: 'DialogController',
//                controllerAs: 'dvm',
//                templateUrl: 'static/app/new-item/new-item.template.html',
//                parent: angular.element(document.body),
//                targetEvent: event,
//                clickOutsideToClose:true,
//                fullscreen: useFullScreen,
//                locals: {
//                    edit: edit,
//                    activity: activity,
//                    start: undefined
//                }
//            })
//            .then(function(activity) {
//
//                if (!activity.quantity){
//                    activity.quantity = 1;
//                }
//                if (vm.calendar.data == null) {
//                    vm.calendar.data = {};
//                }
//                if (keyIn != null) {
//                    vm.calendar.data[keyIn] = activity;
//                    vm.updateCurrency(vm.baseCurrency);
//                }
//                else {
//                    vm.calendar.data.push(activity);
//                    vm.updateCurrency(vm.baseCurrency);
//                }
//
//                CalendarService.update(vm.calendar.id, vm.calendar.data, updateCalendar);
//
//            }, function() {
//                $scope.status = 'You cancelled the dialog.';
//            });
//
//            $scope.$watch(function() {
//                return $mdMedia('xs') || $mdMedia('sm');
//            }, function(wantsFullScreen) {
//                vm.customFullscreen = (wantsFullScreen === true);
//            });
//
//        }