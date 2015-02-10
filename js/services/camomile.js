angular.module('camomile.services', [])

.factory('camomileService', ['camomileConfig', function (camomileConfig) {

  camomile.setURL(camomileConfig.backend);
  return camomile;

}]);
