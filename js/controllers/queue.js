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

  $scope.newQueue = function (queue) {

    Camomile.createQueue(queue.name, {}, function (error, queue) {
      $scope.$parent.updateQueues();
      $scope.model.queue.name = undefined;
    });
  };

  $scope.deleteQueue = function (queue) {

    Camomile.deleteQueue(queue._id, function (error, data) {
      $scope.$parent.updateQueues();
    });
  };

  $scope.emptyQueue = function (queue) {

    var fields = {};
    fields.list = [];
    Camomile.updateQueue(queue._id, fields, function (error, data) {
      $scope.$parent.updateQueues();
    });
  };

  $scope.setQueuePermissionForGroup = function (queue, group, permission) {
    Camomile.setQueuePermissionsForGroup(queue, group, permission, function (error, data) {
      $scope.$parent.updateQueues();
    });
  };

  $scope.setQueuePermissionForUser = function (queue, user, permission) {
    Camomile.setQueuePermissionsForUser(queue, user, permission, function (error, data) {
      $scope.$parent.updateQueues();
    });
  };

  $scope.removeQueuePermissionForGroup = function (queue, group) {
    Camomile.removeQueuePermissionsForGroup(queue, group, function (error, data) {
      $scope.$parent.updateQueues();
    });
  };

  $scope.removeQueuePermissionForUser = function (queue, user) {
    Camomile.removeQueuePermissionsForUser(queue, user, function (error, data) {
      $scope.$parent.updateQueues();
    });
  };

}]);