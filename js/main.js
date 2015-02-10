
var app = (function (camomile) {

  "use strict";

  var my = {};

  my.current = {};

  my.current.corpora = [];
  my.current.corpus = {};

  my.current.media = [];
  my.current.medium = {};

  my.current.layers = [];
  my.current.layer = {};

  my.current.annotations = [];

  my.log = function (data) {
    console.log('app ' + data);
  };

  // my.login = function () {
  //   console.log($('#camomileLoginForm'));
  // };

  return my;

}(camomile));