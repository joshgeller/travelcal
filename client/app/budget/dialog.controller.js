(function() {
  'use strict';

  angular
    .module('travelcal.budget')
    .controller('DialogController', DialogController);

  DialogController.$inject = [
    '$mdDialog',
    'locals'
  ];

  function DialogController($mdDialog, locals) {
    var vm = this;
    vm.edit = locals.edit;
    vm.activity = locals.activity;
    vm.start = locals.start;
    vm.trip = locals.trip;
    vm.updatingTrip = false;

    vm.add = add;
    vm.deleteActivity = deleteActivity;
    vm.hide = hide;
    vm.cancel = cancel;
    vm.update = update;
    vm.updateTrip = updateTrip;

    init();

    function init() {
      if (vm.trip) {
        vm.updatingTrip = true;
        vm.trip.start = new Date(vm.trip.start_date);
        vm.trip.end = new Date(vm.trip.end_date);
      }
    }

    function updateTrip(answer) {
      console.log('updating');
      answer.updating = true;
      $mdDialog.hide(answer);
    }

    function hide() {
      console.log('hiding');
      $mdDialog.hide();
    };

    function add(answer) {
      console.log('adding trip');
      $mdDialog.hide(answer);
    }

    function cancel() {
      console.log('canceling');
      $mdDialog.cancel();
    };

    function deleteActivity() {
      $mdDialog.hide(true);
    }

    function update(activity) {
      if (!activity.currency) {
        activity.currency = 'USD';
      }
      $mdDialog.hide(activity);
    };
  }
})();
