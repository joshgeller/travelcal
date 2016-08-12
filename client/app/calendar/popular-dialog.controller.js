(function() {
  'use strict';

  angular
    .module('travelcal.calendar')
    .controller('PopularDialogController', PopularDialogController);

  PopularDialogController.$inject = [
    '$mdDialog',
    '$scope',
    'CalendarService'
  ];

  function PopularDialogController($mdDialog, $scope, CalendarService) {
    var vm = this;
    vm.addActivity = addActivity;
    vm.filterList = filterList;
    vm.query = ''
    init();

    function init() {
      CalendarService.retrievePopular(function(result, response) {
        if (result) {
           vm.popular_activities = response.data;
        }
      });
    };

    function hide() {
      $mdDialog.hide();
    };

    function addActivity(answer) {
        $mdDialog.hide(answer);
    };

    function cancel() {
      $mdDialog.cancel();
    };

    function filterList(item) {
      return item.title && item.title.toLowerCase().includes(vm.query);
    }

  }
})();
