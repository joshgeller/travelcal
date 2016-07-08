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
    vm.email = '';
    vm.password = '';

  }

})();
