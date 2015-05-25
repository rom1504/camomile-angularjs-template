angular.module('camomileApp.controllers.user', [])

.filter('userInGroup', function () {
  return function (users, group) {
    var usersInGroup = [];
    for (var i = 0; i < users.length; i++) {
      var user = users[i];
      if (group.users.indexOf(user._id) > -1) {
        usersInGroup.push(user);
      }
    }
    return usersInGroup;
  };
})

.filter('groupContainsUser', function () {
  return function (groups, user) {
    var userGroups = [];
    for (var i = 0; i < groups.length; i++) {
      var group = groups[i];
      if (group.users.indexOf(user._id) > -1) {
        userGroups.push(group);
      }
    }
    return userGroups;
  };
})

.controller('UserCtrl', ['$scope', 'Camomile', function ($scope, Camomile) {

  $scope.model = {};

  $scope.model.users = [];
  $scope.model.addUserToGroup = {};
  $scope.model.groups = [];
  $scope.model.addGroupForUser = {};

  // update list of users 
  var getUsers = function () {
    Camomile.getUsers(function (err, data) {
      var corpora;
      if (err) {
        users = [];
      } else {
        users = data;
      }

      // nested in $scope.$apply to make sure a change event is triggered
      $scope.$apply(function () {
        $scope.model.users = users;
        for (var i = users.length - 1; i >= 0; i--) {
          $scope.model.addUserToGroup[users[i]._id] = undefined;
        };
      });

    });
  };

  // update list of media
  var getGroups = function () {
    Camomile.getGroups(function (err, data) {
      var groups;
      if (err) {
        groups = [];
      } else {
        groups = data;
      }
      // nested in $scope.$apply to make sure a change event is triggered
      $scope.$apply(function () {
        $scope.model.groups = groups;
        for (var i = groups.length - 1; i >= 0; i--) {
          $scope.model.addGroupForUser[groups[i]._id] = undefined;
        };

      });
    });
  };

  // get users on lonad
  getUsers();
  getGroups();

  // make sure to update users and groups on login/logout
  $scope.$parent.onLogInOrOut(function () {
    getUsers();
    getGroups();
  });

  $scope.newUser = function (user) {
    if (user.isAdmin) {
      user.role = 'admin';
    } else {
      user.role = 'user';
    }

    Camomile.createUser(user.username, user.password, {}, user.role, function (error, user) {
      getUsers();
    });
  };

  $scope.newGroup = function (group) {
    Camomile.createGroup(group.name, {}, function (error, group) {
      getGroups();
    });
  };

  $scope.addUserToGroup = function (user) {
    Camomile.addUserToGroup(
      user._id,
      $scope.model.addUserToGroup[user._id],
      function (error, data) {
        $scope.model.addUserToGroup[user._id] = undefined;
        getGroups();
      });
  };

  $scope.addGroupForUser = function (group) {
    Camomile.addUserToGroup(
      $scope.model.addGroupForUser[group._id],
      group._id,
      function (error, data) {
        $scope.model.addGroupForUser[group._id] = undefined;
        getGroups();
      });
  };

  $scope.removeUserFromGroup = function (user, group) {
    Camomile.removeUserFromGroup(
      user._id,
      group._id,
      function (error, data) {
        getGroups();
      }
    );
  };

}]);