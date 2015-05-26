angular.module('camomile.controllers', [])

.controller('CamomileCtrl', ['$scope', 'Camomile', function ($scope, Camomile) {

  $scope.credentials = {};

  $scope.camomile = {};
  $scope.camomile.me = undefined;

  $scope.camomile.users = {};
  $scope.camomile.users.list = [];
  $scope.camomile.users.id2name = {};

  $scope.camomile.groups = {};
  $scope.camomile.groups.list = [];
  $scope.camomile.groups.id2name = {};

  $scope.camomile.corpora = {};
  $scope.camomile.corpora.list = [];
  $scope.camomile.corpora.permissions = {};

  var onLoginCallback;
  // set callback called after login
  $scope.onLogin = function (callback) {
    onLoginCallback = callback;
  };

  var onLogoutCallback;
  // set callback called after logout
  $scope.onLogout = function (callback) {
    onLogoutCallback = callback;
  };

  // set callback called after login and/or logout
  $scope.onLogInOrOut = function (callback) {

    onLoginCallback = callback;
    onLogoutCallback = callback;
  };

  // authenticate user by making a call to /me
  var _authenticate = function (callback) {

    Camomile.me(function (err, me) {

      updateAll();

      if (err) {
        me = undefined;
      }

      $scope.$apply(function () {
        $scope.camomile.me = me;
      });

      // only call callback if it is defined
      callback && callback();
    });
  };

  // login using credentials from the login form
  // then call onLoginCallback (usually set by child controller)
  $scope.login = function () {
    Camomile.login($scope.credentials.username, $scope.credentials.password, function (err) {
      if (!err) {
        updateAll();
        _authenticate(onLoginCallback);
      }
    });
  };

  // logout
  // then call onLogoutCallabck (usually set by child controller)
  $scope.logout = function () {
    Camomile.logout(function (err) {
      if (!err) {
        updateAll();
        _authenticate(onLogoutCallback);
      }
    });
  };

  // update list of users 
  var updateUsers = $scope.updateUsers = function () {
    Camomile.getUsers(function (err, users) {

      if (err) {
        users = [];
      }

      $scope.$apply(function () {
        $scope.camomile.users.list = users;
        for (var i = users.length - 1; i >= 0; i--) {
          $scope.camomile.users.id2name[users[i]._id] = users[i].username;
        };
      });
    });
  };

  // update list of groups
  var updateGroups = $scope.updateGroups = function () {

    Camomile.getGroups(function (err, groups) {

      if (err) {
        groups = [];
      }

      $scope.$apply(function () {
        $scope.camomile.groups.list = groups;
        for (var i = groups.length - 1; i >= 0; i--) {
          $scope.camomile.groups.id2name[groups[i]._id] = groups[i].name;
        };
      });
    });
  };

  var _getCorpusPermissionsCallback = function (corpus) {
    return function (err, permissions) {

      if (err) {
        permissions = {
          'users': {},
          'groups': {}
        };
      }

      $scope.$apply(function () {
        $scope.camomile.corpora.permissions[corpus] = permissions;
      });
    }
  };

  // update list of corpora
  var updateCorpora = $scope.updateCorpora = function () {

    Camomile.getCorpora(function (err, corpora) {

      if (err) {
        corpora = [];
      }

      $scope.$apply(function () {
        $scope.camomile.corpora.list = corpora;
        for (i = corpora.length - 1; i >= 0; i--) {
          var corpus = corpora[i]._id;
          Camomile.getCorpusPermissions(
            corpus, _getCorpusPermissionsCallback(corpus));
        };

      });

    });

  };

  var updateAll = function () {
    updateUsers();
    updateGroups();
    updateCorpora();
    // updateQueues();
  };

  // authenticate user on load
  _authenticate();

}]);