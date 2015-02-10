
// This configuration file is used by the Camomile service
// to know the URL of the Camomile REST API

angular.module('camomileApp.production', [])
  .constant('camomileConfig', {
    backend: 'https://camomile.fr/api'
  });

angular.module('camomileApp.development', [])
  .constant('camomileConfig', {
    backend: 'https://dev.camomile.fr/api'
  });

// More info on configuration files 
// at http://www.ng-newsletter.com/advent2013/#!/day/5
