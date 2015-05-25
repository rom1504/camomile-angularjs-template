angular.module('camomileApp.controllers.queue', [])

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

.controller('QueueCtrl', ['$scope', 'Camomile', function ($scope, Camomile) {

  $scope.model = {};
  $scope.model.queues = [];
  $scope.model.permissions = {};
  $scope.model.username = {};
  $scope.model.groupname = {};

  var _getQueuePermissionsCallback = function (queue) {
    return function (error, permission) {
      $scope.$apply(function () {
        $scope.model.permissions[queue] = permission;
      });
    }
  };

  // update list of users 
  var getQueues = function () {

    Camomile.getQueues(function (err, queues) {

      $scope.$apply(function () {
        $scope.model.queues = queues;
      });

      for (i = queues.length - 1; i >= 0; i--) {
        var queue = queues[i]._id;
        Camomile.getQueuePermissions(queue, _getQueuePermissionsCallback(queue));
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

  // get queues on load
  getQueues();
  getUsers();
  getGroups();

  // make sure to update queues on login/logout
  $scope.$parent.onLogInOrOut(function () {
    getQueues();
  });

  $scope.newQueue = function (queue) {

    Camomile.createQueue(queue.name, {}, function (error, queue) {
      getQueues();
      $scope.queue.name = undefined;
    });
  };

  $scope.deleteQueue = function (queue) {

    Camomile.deleteQueue(queue._id, function (error, data) {
      getQueues();
    });
  };

  $scope.setQueuePermissionForGroup = function (queue, group, permission) {
    Camomile.setQueuePermissionsForGroup(queue, group, permission, function (error, data) {
      getQueues();
    });
  };

  $scope.setQueuePermissionForUser = function (queue, user, permission) {
    Camomile.setQueuePermissionsForUser(queue, user, permission, function (error, data) {
      getQueues();
    });
  };

  $scope.removeQueuePermissionForGroup = function (queue, group) {
    Camomile.removeQueuePermissionsForGroup(queue, group, function (error, data) {
      getQueues();
    });
  };

  $scope.removeQueuePermissionForUser = function (queue, user) {
    Camomile.removeQueuePermissionsForUser(queue, user, function (error, data) {
      getQueues();
    });
  };

}]);