'use strict';

angular
    .module('StockChartApp', ['ngRoute', 'toastr', 'ngCookies', 'highcharts-ng'])
    .config(config);

config.$inject = ['$routeProvider', '$locationProvider'];

function config($routeProvider, $locationProvider) {

    $locationProvider.html5Mode(true);
    
    //Enable cross domain calls
    // $httpProvider.defaults.useXDomain = true;
    // delete $httpProvider.defaults.headers.common['X-Requested-With'];

    // $httpProvider.defaults.headers.common['Access-Control-Allow-Headers'] = '*';
    // $httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    // $httpProvider.defaults.headers.common['Access-Control-Allow-Methods'] = 'GET,POST,PUT,HEAD,DELETE,OPTIONS';

    // Now set up the states
    // $routeProvider
    //     .when('/', {
    //         templateUrl: '/',
    //         controller: 'MainController',
    //         controllerAs: 'vm'
    //     })
    //     .otherwise({
    //         redirectTo: '/'
    //     });
}
