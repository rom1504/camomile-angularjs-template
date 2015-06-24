angular.module('camomileApp.controllers.leaderboard', [
    "ngSanitize",
  ])
  .controller('LeaderboardCtrl', ['$scope', '$sce', 'Camomile', function ($scope, $sce, Camomile) {

    $scope.testCorpus = undefined;
    $scope.leaderboard = undefined;

    var getTestCorpus = function (callback) {
      var testCorpusName = 'mediaeval.test';
      var options = {};
      options.returns_id = true;
      options.filter = {};
      options.filter.name = testCorpusName;
      Camomile.getCorpora(callback, options);
    };

    var findTeamName = function (allGroups, myGroups) {

      // id --> name mapping 
      var group2name = {};
      for (var i = allGroups.length - 1; i >= 0; i--) {
        var group = allGroups[i];
        group2name[group._id] = group.name;
      };

      // find group starting by 'team_'
      for (var i = myGroups.length - 1; i >= 0; i--) {
        var group = myGroups[i];
        if (group2name[group].lastIndexOf('team_', 0) === 0) {
          return group2name[group];
        }
      };

      return undefined;

    };

    var getLeaderboard = function () {

      async.parallel({
        'allGroups': Camomile.getGroups,
        'myGroups': Camomile.getMyGroups,
        'corpus': getTestCorpus
      }, function (error, results) {
        if (error) {
          alert('Cannot load your private leaderboard: are you logged in?');
          return;
        }

        var teamName = findTeamName(results.allGroups[0], results.myGroups[0]);
        var leaderboardName = 'leaderboard (' + teamName + ')';

        var options = {};
        options.filter = {};
        options.filter.name = leaderboardName;
        options.filter.id_corpus = results.corpus[0];

        Camomile.getLayers(
          function (error, layers) {
            $scope.$apply(function () {
              $scope.leaderboard = layers[0].description;
            });
          },
          options);

      });

    };

    // get corpora on load
    getLeaderboard();
    // make sure to update corpora on login/logout
    // as different users have access to different corpora
    $scope.$parent.onLogInOrOut(getLeaderboard);

  }]);