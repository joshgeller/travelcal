(function() {
  'use strict';

  angular
    .module('travelcal.calendar')
    .controller('PopularDialogController', PopularDialogController);

  PopularDialogController.$inject = [
    '$mdDialog',
    '$scope'
  ];

  function PopularDialogController($mdDialog, $scope) {
    var vm = this;
    vm.addActivity = addActivity;
    init();

    function init() {
      // get activity list?
    };

    function hide() {
      console.log('hiding');
      $mdDialog.hide();
    };

    function addActivity(answer) {
        $mdDialog.hide(answer);
    };

    function cancel() {
      console.log('canceling');
      $mdDialog.cancel();
    };

  }
})();
