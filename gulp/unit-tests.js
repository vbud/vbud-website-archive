'use strict';

var gulp = require('gulp');

var wiredep = require('wiredep');
var karma = require('karma');
var concat = require('concat-stream');
var _ = require('lodash');

var config = require('./config');
var paths = config.paths;


function listFiles(callback) {
  var wiredepOptions = _.extend({}, config.wiredep, {
    dependencies: true,
    devDependencies: true
  });
  var bowerDeps = wiredep(wiredepOptions);

  var specFiles = [
    paths.src + '/**/*.spec.js',
    paths.src + '/**/*.mock.js'
  ];

  var htmlFiles = [
    paths.src + '/**/*.html'
  ];

  var srcFiles = [
    paths.tmpServe + '/index.js'
  ].concat(specFiles.map(function(file) {
    return '!' + file;
  }));


  gulp.src(srcFiles)
    .pipe(concat(function(files) {
      callback(bowerDeps.js
        .concat(_.pluck(files, 'path'))
        .concat(htmlFiles)
        .concat(specFiles));
    }));
}

function runTests (singleRun, done) {
  listFiles(function(files) {
    karma.server.start({
      configFile: __dirname + '/../karma.conf.js',
      files: files,
      singleRun: singleRun,
      autoWatch: !singleRun
    }, done);
  });
}

gulp.task('test', ['scripts'], function(done) {
  runTests(true, done);
});
gulp.task('test:auto', ['watch'], function(done) {
  runTests(false, done);
});
