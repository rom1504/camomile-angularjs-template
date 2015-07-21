angular.module('camomileApp.controllers.monitoring', [
    "ngSanitize",
  ])
  .controller('MonitoringCtrl', ['$scope', '$sce', 'Camomile', function ($scope, $sce, Camomile) {

    $scope.corpus = undefined;
    $scope.layers = {};
    $scope.media = {};
    $scope.count = {};
    $scope.atLeastOne = {};

    var fFindCorpusByName = function (corpusName) {
      return function (callback) {

        if ($scope.corpus !== undefined) {
          callback(null, $scope.corpus);
          return;
        }

        var options = {};
        options.returns_id = true;
        options.filter = {};
        options.filter.name = corpusName;

        Camomile.getCorpora(
          function (error, corpora) {

            if (error) {
              callback(error, null);
              return;
            }

            if (corpora.length == 0) {
              callback('Coud not find corpus ' + corpusName, null);
              return;
            }

            $scope.$apply(function () {
              $scope.corpus = corpora[0];
            });

            callback(null, $scope.corpus);
          },
          options);
      };
    };

    var fFindMedia = function (id_corpus) {

      return function (callback) {

        var options = {};
        options.filter = {};
        options.filter.id_corpus = id_corpus;
        Camomile.getMedia(function (error, media) {
          if (error) {
            callback(error, null);
            return;
          }
          for (var i = media.length - 1; i >= 0; i--) {
            var medium = media[i];
            $scope.$apply(function () {
              $scope.media[medium.name] = medium._id;
            });
          };
          callback(null, $scope.media);
        }, options);
      }
    };

    var fFindLayerByName = function (id_corpus, layerName) {
      return function (callback) {

        var options = {};
        options.returns_id = true;
        options.filter = {};
        options.filter.name = layerName;
        options.filter.id_corpus = id_corpus;

        Camomile.getLayers(function (error, layers) {

          if (error) {
            callback(error, null);
            return;
          }

          if (layers.length == 0) {
            callback('Could not find layer ' + layerName, null);
            return;
          }

          if (layers.length > 1) {
            callback('Too many layers ' + layerName, null);
            return;
          }

          callback(null, layers[0]);

        }, options);
      }
    };

    var fFindLayers = function (id_corpus) {

      return function (callback) {

        async.parallel({
          'shot': fFindLayerByName(
            id_corpus, 'mediaeval.submission_shot'),
          'all': fFindLayerByName(
            id_corpus, 'mediaeval.groundtruth.label.all'),
          'consensus': fFindLayerByName(
            id_corpus, 'mediaeval.groundtruth.label.consensus'),
        }, function (error, layers) {

          if (error) {
            callback(error, null);
            return;
          }

          callback(null, layers);

          $scope.$apply(function () {
            $scope.layers = layers;
          });

        });
      };
    };

    var fCountAnnotations = function (id_layer, id_medium) {

      return function (callback) {
        var options = {};
        options.returns_count = true;
        options.filter = {};
        options.filter.id_medium = id_medium;
        options.filter.id_layer = id_layer;

        Camomile.getAnnotations(function (error, n) {

          if (error) {
            console.log(error);
            callback(error, null);
            return;
          }

          if ($scope.count[id_layer] === undefined) {
            $scope.count[id_layer] = {};
          }
          $scope.$apply(function () {
            $scope.count[id_layer][id_medium] = n;
          });

          callback(null, n);

        }, options);
      };
    };

    var fCountAtLeastOneAnnotation = function (id_layer, id_medium) {

      return function (callback) {
        var options = {};
        options.filter = {};
        options.filter.id_medium = id_medium;
        options.filter.id_layer = id_layer;

        Camomile.getAnnotations(function (error, annotations) {

          if (error) {
            callback(error, null);
            return;
          }

          var shots = new Set();
          for (var i = 0; i < annotations.length; i++) {
            shots.add(annotations[i].fragment);
          }

          $scope.$apply(function () {
            $scope.atLeastOne[id_medium] = shots.size;
          });

          callback(null, shots.size);

        }, options);
      };
    };

    var getMonitoring = function () {

      // find corpus
      fFindCorpusByName('mediaeval.test')(

        function (error, id_corpus) {

          if (error) {
            console.log(error);
            return;
          }

          // find layers and media in parallele
          async.parallel({
            'layers': fFindLayers(id_corpus),
            'media': fFindMedia(id_corpus),
          }, function (error, results) {

            if (error) {
              console.log(error);
              return;
            }

            async.forEachOfSeries(
              results.media,
              function (id_medium, mediumName, callback) {

          var process = mediumName.startsWith('FPVDB0701') ||
            mediumName.startsWith('FPVDB0702') ||
            mediumName.startsWith('FPVDB0703');

          if (!process) {
            callback(null, 0);
            return;
          }
                async.forEachOf(
                  results.layers,
                  function (id_layer, layerName, callback) {
                    if (layerName !== 'all') {
                      fCountAnnotations(id_layer, id_medium)(callback);
                    } else {
                      fCountAtLeastOneAnnotation(id_layer, id_medium)(callback);
                    }
                  },
                  callback);
              },
              function (err) {
                if (err) {
                  console.log(err);
                }
              });

          });
        });
    };

    // load monitoring
    getMonitoring();
    // make sure to load monitoring on login/logout
    $scope.$parent.onLogInOrOut(getMonitoring);

  }]);
