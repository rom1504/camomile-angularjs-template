angular.module('camomile.controllers', [])

.controller('CamomileCtrl', ['$scope', 'Camomile', function ($scope, client) {

  $scope.user = undefined;

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
  var _authenticate = function () {
    return client.me()
      .then(data => $scope.$apply(() => $scope.user=data))
      .catch(err => $scope.$apply(() => $scope.user=undefined));
  };

  // authenticate user on load
  _authenticate();

  // login using credentials from the login form
  // then call onLoginCallback (usually set by child controller)
  $scope.credentials = {};
  $scope.login = function () {
  client.login($scope.credentials.username, $scope.credentials.password)
    .then(_authenticate)
    .then(() => onLoginCallback(null));
  };

  // logout
  // then call onLogoutCallabck (usually set by child controller)
  $scope.logout = function () {
    client.logout
      .then(() => _authenticate())
      .then(() => onLogoutCallback(null))  
  };

}]);
