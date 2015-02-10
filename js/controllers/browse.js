angular.module('camomileApp.controllers.browse', [])
.controller('BrowseCtrl', ['$scope', 'camomileService', function ($scope, camomileService) {

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
  // list of layers in selected corpus
  $scope.browse.layers = [];
  // selected layer
  $scope.browse.layer = undefined;

  // update list of corpora 
  var getCorpora = function () {
    camomileService.getCorpora(function (err, data) {
      var corpora;
      if (err) { corpora = []; } else { corpora = data; }
      // nested in $scope.$apply to make sure a change event is triggered
      $scope.$apply(function () { $scope.browse.corpora = corpora; });
    });
  };

  // update list of media
  var getMedia = function () {
    camomileService.getMedia(function (err, data) {
      var media;
      if (err) { media = []; } else { media = data; }
      // nested in $scope.$apply to make sure a change event is triggered
      $scope.$apply(function () { $scope.browse.media = media; });
    }, {'corpus': $scope.browse.corpus});
  };

  // update list of layers
  var getLayers = function () {
    camomileService.getLayers(function (err, data) {
      var layers;
      if (err) { layers = []; } else { layers = data; }
      // nested in $scope.$apply to make sure a change event is triggered
      $scope.$apply(function () { $scope.browse.layers = layers; });
    }, {'corpus': $scope.browse.corpus});
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

}]);
