angular.module('camomileApp.controllers.corpus', [])

.filter('humanReadablePermission', function () {
  return function (permission) {
    if (permission === 1) {
      return 'READ'
    };
    if (permission === 2) {
      return 'WRITE'
    };
    if (permission === 3) {
      return 'ADMIN'
    };
  };
})

.filter('bootstrapPermission', function () {
  return function (permission) {
    if (permission === 1) {
      return 'success'
    };
    if (permission === 2) {
      return 'primary'
    };
    if (permission === 3) {
      return 'danger'
    };
  };
})

.controller('CorpusCtrl', ['$scope', 'Camomile', function ($scope, Camomile) {

  $scope.model = {};
  $scope.model.selectedCorpus = undefined;
  $scope.model.media = {};
  $scope.model.media.list = {};

  $scope.createCorpus = function (corpus) {

    Camomile.createCorpus(corpus.name, {}, function (error, corpus) {
      $scope.corpus.name = undefined;
      $scope.$parent.updateCorpora();
    });
  };

  $scope.deleteCorpus = function (corpus) {

    Camomile.deleteCorpus(corpus._id, function (error, data) {
      $scope.$parent.updateCorpora();
    });
  };

  $scope.setCorpusPermissionForGroup = function (corpus, group, permission) {
    Camomile.setCorpusPermissionsForGroup(corpus, group, permission, function (error, data) {
      $scope.$parent.updateCorpora();
    });
  };

  $scope.setCorpusPermissionForUser = function (corpus, user, permission) {
    Camomile.setCorpusPermissionsForUser(corpus, user, permission, function (error, data) {
      $scope.$parent.updateCorpora();
    });
  };

  $scope.removeCorpusPermissionForGroup = function (corpus, group) {
    Camomile.removeCorpusPermissionsForGroup(corpus, group, function (error, data) {
      $scope.$parent.updateCorpora();
    });
  };

  $scope.removeCorpusPermissionForUser = function (corpus, user) {
    Camomile.removeCorpusPermissionsForUser(corpus, user, function (error, data) {
      $scope.$parent.updateCorpora();
    });
  };

  var updateMedia = function (corpus) {

    var options = {
      'filter': {
        'id_corpus': corpus
      }
    };

    Camomile.getMedia(
      function (err, media) {

        if (err) {
          media = [];
        }

        $scope.$apply(function () {
          $scope.model.media.list = media;
        });

      },
      options);

  };

  $scope.selectCorpus = function (corpus) {
    $scope.model.selectedCorpus = corpus;
  };

  $scope.$watch('model.selectedCorpus', function () {
    updateMedia($scope.model.selectedCorpus);
  });

}]);