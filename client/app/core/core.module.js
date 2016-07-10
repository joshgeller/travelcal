(function() {
  'use strict';

  angular
    .module('travelcal.core', [
      'ngMaterial',
      'ngMdIcons',
      'ngStorage',
      'ngMessages',
      'ngStorage',
      'ui.router'
    ])
    .config(function($mdThemingProvider) {
      $mdThemingProvider
      .theme('default')
      .primaryPalette('blue')
      .accentPalette('blue-grey')
    });
})();
