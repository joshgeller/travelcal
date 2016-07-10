(function() {
  'use strict';

  angular
    .module('travelcal.core', [
      'ui.router',
      'ngMaterial',
      'ngMdIcons',
      'ngStorage',
    ])
    .config(function($mdThemingProvider) {
      $mdThemingProvider
      .theme('default')
      .primaryPalette('blue')
      .accentPalette('blue-grey')
    });
})();
