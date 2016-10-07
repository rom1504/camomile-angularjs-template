angular.module('camomile.services', [])

.factory('Camomile', ['camomileConfig', function (camomileConfig) {

  return new Camomile(camomileConfig.backend);

}]);
