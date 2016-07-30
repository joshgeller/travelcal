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
    vm.hide = function() {
      $mdDialog.hide();
    };

    vm.add = function(answer) {
      $mdDialog.hide(answer);
    }

    vm.cancel = function() {
      $mdDialog.cancel();
    };

    vm.deleteActivity = function() {
      $mdDialog.hide(true);
    }

    vm.update = function(activity) {
      if (!activity.currency) {
        activity.currency = 'USD';
      }
      $mdDialog.hide(activity);
    };
  }
})();
