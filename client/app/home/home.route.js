// Authentication method derived from: https://github.com/cornflourblue/angular-jwt-authentication-example/

(function () {
  'use strict';

  angular
    .module('travelcal.home')
    .config(HomeConfig)
    .run(run);

    HomeConfig.$inject = [
      '$stateProvider',
      '$urlRouterProvider'
    ];

    function HomeConfig($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/triplist');
      $stateProvider
        .state('travelcal.home', {
          url: '/',
          views: {
            'travelcalContent': {
              templateUrl: 'static/app/triplist/triplist.template.html',
              controller: 'TriplistController',
              controllerAs: 'vm'
            }
          }
        })
        .state('travelcal.home_old', {
          url: '/old_homeas;ldfjas;ldfjas;ldfjas;dlf',
          views: {
            'travelcalContent': {
              redirectTo: 'travelcal.home'
            }
          }
        })
        .state('travelcal.login', {
          url: '/login',
          views: {
            'travelcalContent': {
              templateUrl: 'static/app/login/login.template.html',
              controller: 'LoginController',
              controllerAs: 'vm'
            }
          }
        })
        .state('travelcal.logout', {
          url: '/logout',
          views: {
            'travelcalContent': {
              templateUrl: 'static/app/login/login.template.html',
              controller: 'LoginController',
              controllerAs: 'vm'
            }
          }
        });
    }

    run.$inject = [
      '$rootScope',
      '$http',
      '$location',
      '$localStorage'
    ];

    function run($rootScope, $http, $location, $localStorage) {
      if ($localStorage.authenticatedUser) {
        $http.defaults.headers.common.Authorization = 'Token ' + $localStorage.authenticatedUser.token;
      }

      // redirect to login page if user is not authenticated
      $rootScope.$on('$locationChangeStart', function(event, next, current) {
        // array of pages that can load without authentication
        var nonAuthPages = ['/login', '/logout', '/register'];
        // anything that requires authentication is restricted, which is everything that is
        // not in the nonAuthPages array
        var restrictedPage = nonAuthPages.indexOf($location.path()) === -1;
        if (restrictedPage && !$localStorage.authenticatedUser) {
          $location.path('/login');
        }
      });
    }
})();
