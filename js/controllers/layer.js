angular.module('camomileApp.controllers.layer', [])

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

.controller('LayerCtrl', ['$scope', 'Camomile', function ($scope, Camomile) {

  $scope.model = {};
  $scope.model.selectedCorpus = undefined;
  $scope.model.layers = {};
  $scope.model.layers.list = [];
  $scope.model.layers.permissions = {};

  var _getLayerPermissionsCallback = function (layer) {
    return function (err, permissions) {

      if (err) {
        permissions = {
          'users': {},
          'groups': {}
        };
      }

      $scope.$apply(function () {
        $scope.model.layers.permissions[layer] = permissions;
      });
    }
  };

  $scope.$watch('model.selectedCorpus', function () {
    updateLayers($scope.model.selectedCorpus);
  });

  var updateLayers = function (corpus) {

    if (corpus === undefined) {
      $scope.model.layers.list = [];
      $scope.model.layers.permissions = {};
      return;
    }

    var options = {
      'filter': {
        'id_corpus': corpus
      }
    };

    Camomile.getLayers(
      function (err, layers) {

        if (err) {
          layers = [];
        }

        $scope.$apply(function () {
          $scope.model.layers.list = layers;
          for (var i = layers.length - 1; i >= 0; i--) {
            var layer = layers[i]._id;
            Camomile.getLayerPermissions(
              layer, _getLayerPermissionsCallback(layer));
          };
        });

      },
      options);
  };

  $scope.deleteLayer = function (layer) {

    Camomile.deleteLayer(layer._id, function (error, data) {
      updateLayers($scope.model.selectedCorpus);
    });
  };

  $scope.setLayerPermissionForGroup = function (layer, group, permission) {
    Camomile.setLayerPermissionsForGroup(layer, group, permission, function (error, data) {
      updateLayers($scope.model.selectedCorpus);
    });
  };

  $scope.setLayerPermissionForUser = function (layer, user, permission) {
    Camomile.setLayerPermissionsForUser(layer, user, permission, function (error, data) {
      updateLayers($scope.model.selectedCorpus);
    });
  };

  $scope.removeLayerPermissionForGroup = function (layer, group) {
    Camomile.removeLayerPermissionsForGroup(layer, group, function (error, data) {
      updateLayers($scope.model.selectedCorpus);
    });
  };

  $scope.removeLayerPermissionForUser = function (layer, user) {
    Camomile.removeLayerPermissionsForUser(layer, user, function (error, data) {
      updateLayers($scope.model.selectedCorpus);
    });
  };

}]);