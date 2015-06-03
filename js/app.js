var camomileApp = angular.module('camomileApp', [
    'ngRoute',
    'angular-flash.service',
    'angular-flash.flash-alert-directive',
    'camomile.controllers',
    'camomile.services',
    'camomileApp.production',
    'camomileApp.controllers.browse',
    'camomileApp.controllers.user',
    'camomileApp.controllers.corpus',
    'camomileApp.controllers.layer',
    'camomileApp.controllers.queue'
]);

camomileApp.config(['$routeProvider', function ($routeProvider) {

    $routeProvider.when('/user', {
        templateUrl: 'partials/user.html',
        controller: 'UserCtrl'
    });
    $routeProvider.when('/corpus', {
        templateUrl: 'partials/corpus.html',
        controller: 'CorpusCtrl'
    });
    $routeProvider.when('/layer', {
        templateUrl: 'partials/layer.html',
        controller: 'LayerCtrl'
    });
    $routeProvider.when('/queue', {
        templateUrl: 'partials/queue.html',
        controller: 'QueueCtrl',
        controllerAs: 'queue'
    });
    $routeProvider.otherwise({
        redirectTo: '/'
    });
}]);

camomileApp.config(function (flashProvider) {

    // Support bootstrap 3.0 "alert-danger" class with error flash types
    flashProvider.errorClassnames.push('alert-danger');

    /**
     * Also have...
     *
     * flashProvider.warnClassnames
     * flashProvider.infoClassnames
     * flashProvider.successClassnames
     */

});