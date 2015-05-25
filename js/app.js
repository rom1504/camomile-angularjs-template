var camomileApp = angular.module('camomileApp', ['ngRoute',
    'camomile.controllers',
    'camomile.services',
    'camomileApp.production',
    'camomileApp.controllers.browse',
    'camomileApp.controllers.user',
    'camomileApp.controllers.corpus',
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
    $routeProvider.when('/queue', {
        templateUrl: 'partials/queue.html',
        controller: 'QueueCtrl',
        controllerAs: 'queue'
    });
    $routeProvider.otherwise({
        redirectTo: '/'
    });
}]);