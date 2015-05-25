angular.module('camomileApp.controllers.queue', [])

.controller('QueueCtrl', ['$scope', 'Camomile', function ($scope, Camomile) {

  $scope.model = {};

  // update list of users 
  var getQueues = function () {
    Camomile.getQueues(function (err, data) {
      if (err) {
        queues = [];
      } else {
        queues = data;
      }

      // nested in $scope.$apply to make sure a change event is triggered
      $scope.$apply(function () {
        $scope.model.queues = queues;
      });

    });
  };

  // get queues on load
  getQueues();

  // make sure to update users and groups on login/logout
  $scope.$parent.onLogInOrOut(function () {
    getQueues();
  });

  $scope.newQueue = function (queue) {

    Camomile.createQueue(queue.name, {}, function (error, queue) {
      getQueues();
    });
  };

  $scope.deleteQueue = function (queue) {

    Camomile.deleteQueue(queue._id, function (error, data) {
      getQueues();
    });
  };

}]);