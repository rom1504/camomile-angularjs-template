angular.module('camomileApp.controllers.user', [])

.filter('belongsTo', function () {
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

.filter('contains', function () {
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

.filter('bootstrapIsAdmin', function () {
  return function (user) {
    if (user.role === 'admin') {
      return 'danger';
    } else {
      return 'success';
    };
  };
})

.controller('UserCtrl', ['$scope', 'Camomile', function ($scope, Camomile) {

  $scope.createUser = function (user) {
    if (user.isAdmin) {
      user.role = 'admin';
    } else {
      user.role = 'user';
    }

    Camomile.createUser(user.username, user.password, {}, user.role, function (error, user) {
      $scope.$parent.updateUsers();
    });
  };

  $scope.createGroup = function (group) {
    Camomile.createGroup(group.name, {}, function (error, group) {
      $scope.$parent.updateGroups();
    });
  };

  $scope.addUserToGroup = function (user, group) {
    Camomile.addUserToGroup(
      user, group,
      function (error, group) {
        $scope.$parent.updateGroups();
      });
  };

  $scope.removeUserFromGroup = function (user, group) {
    Camomile.removeUserFromGroup(
      user, group,
      function (error, group) {
        $scope.$parent.updateGroups();
      }
    );
  };

}]);