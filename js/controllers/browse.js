angular.module('camomileApp.controllers.browse', [
    "ngSanitize",
    "com.2fdevs.videogular",
    "com.2fdevs.videogular.plugins.controls",
  ])
  .controller('BrowseCtrl', ['$scope', '$sce', 'Camomile', function ($scope, $sce, client) {

    // browsing stauts
    $scope.browse = {};

    // list of corpora available to the user currently logged in
    $scope.browse.corpora = [];
    // selected corpus
    $scope.browse.corpus = undefined;
    // list of media in selected corpus
    $scope.browse.media = [];
    // selected medium
    $scope.browse.medium = undefined;
    // its sources
    $scope.browse.mediumSrc = undefined;
    // list of layers in selected corpus
    $scope.browse.layers = [];
    // selected layer
    $scope.browse.layer = undefined;

    // update list of corpora
    var getCorpora = function () {
      client.getCorpora()
        .then(data => $scope.$apply(() => $scope.browse.corpora = data))
        .catch(err => $scope.$apply(() => $scope.browse.corpora = []));
    };

    // update list of media
    var getMedia = function () {
      client.getMedia({filter:{'id_corpus': $scope.browse.corpus}})
        .then(data => $scope.$apply(() => $scope.browse.media = data))
        .catch(err => $scope.$apply(() => $scope.browse.media = []));
    };
    
    // update list of layers
    var getLayers = function () {
      client.getLayers({filter:{'id_corpus': $scope.browse.corpus}})
        .then(data => $scope.$apply(() => $scope.browse.layers = data))
        .catch(err => $scope.$apply(() => $scope.browse.layers = []));
    };

    // get corpora on load
    getCorpora();
    // make sure to update corpora on login/logout
    // as different users have access to different corpora
    $scope.$parent.onLogInOrOut(getCorpora);

    // update list of media and layers when selected corpus changes
    $scope.$watch('browse.corpus', function () {
      getMedia();
      getLayers();
    });

    $scope.$watch('browse.medium', function () {
      $scope.browse.mediumSrc = [{
        src: $sce.trustAsResourceUrl(client.getMediumURL($scope.browse.medium, "mp4")),
        type: "video/mp4"
      }, {
        src: $sce.trustAsResourceUrl(client.getMediumURL($scope.browse.medium, "ogg")),
        type: "video/ogg"
      }];
    });

  }]);
