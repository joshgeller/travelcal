(function() {
  'use strict';

  angular
    .module('travelcal.new-item')
    .controller('NewItemController', NewItemController);

  NewItemController.$inject = [
    '$http'
  ];

  function NewItemController($http) {
    var vm = this;
      vm.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      vm.selected = [];
      vm.toggle = function (item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) {
            list.splice(idx, 1);
        }
        else {
          list.push(item);
        }
      };
      vm.exists = function (item, list) {
        return list.indexOf(item) > -1;
      }
  }

})();
