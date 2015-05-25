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
  $scope.model.corpora = [];
  $scope.model.permissions = {};
  $scope.model.username = {};
  $scope.model.groupname = {};

  var _getCorpusPermissionsCallback = function (corpus) {
    return function (error, permission) {
      $scope.$apply(function () {
        $scope.model.permissions[corpus] = permission;
      });
    }
  };

  // update list of users 
  var getCorpora = function () {

    Camomile.getCorpora(function (err, corpora) {

      $scope.$apply(function () {
        $scope.model.corpora = corpora;
      });

      for (i = corpora.length - 1; i >= 0; i--) {
        var corpus = corpora[i]._id;
        Camomile.getCorpusPermissions(corpus, _getCorpusPermissionsCallback(corpus));
      };

    });
  };

  // update list of users 
  var getUsers = function () {
    Camomile.getUsers(function (err, data) {
      var users;
      if (err) {
        users = [];
      } else {
        users = data;
      }
      for (var i = users.length - 1; i >= 0; i--) {
        $scope.$apply(function () {
          $scope.model.username[users[i]._id] = users[i].username;
        });
      };
    });

  };

  // update list of users 
  var getGroups = function () {
    Camomile.getGroups(function (err, data) {
      var groups;
      if (err) {
        groups = [];
      } else {
        groups = data;
      }
      for (var i = groups.length - 1; i >= 0; i--) {
        $scope.$apply(function () {
          $scope.model.groupname[groups[i]._id] = groups[i].name;
        });
      };
    });

  };

  // get corpora on load
  getCorpora();
  getUsers();
  getGroups();

  // make sure to update corpora on login/logout
  $scope.$parent.onLogInOrOut(function () {
    getCorpora();
  });

  $scope.newCorpus = function (corpus) {

    Camomile.createCorpus(corpus.name, {}, function (error, corpus) {
      getCorpora();
      $scope.corpus.name = undefined;
    });
  };

  $scope.deleteCorpus = function (corpus) {

    Camomile.deleteCorpus(corpus._id, function (error, data) {
      getCorpora();
    });
  };

  $scope.setCorpusPermissionForGroup = function (corpus, group, permission) {
    Camomile.setCorpusPermissionsForGroup(corpus, group, permission, function (error, data) {
      getCorpora();
    });
  };

  $scope.setCorpusPermissionForUser = function (corpus, user, permission) {
    Camomile.setCorpusPermissionsForUser(corpus, user, permission, function (error, data) {
      getCorpora();
    });
  };

  $scope.removeCorpusPermissionForGroup = function (corpus, group) {
    Camomile.removeCorpusPermissionsForGroup(corpus, group, function (error, data) {
      getCorpora();
    });
  };

  $scope.removeCorpusPermissionForUser = function (corpus, user) {
    Camomile.removeCorpusPermissionsForUser(corpus, user, function (error, data) {
      getCorpora();
    });
  };

}]);