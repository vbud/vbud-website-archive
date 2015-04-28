'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var fs = require('fs');
var through2 = require('through2');
var JSONStream = require('JSONStream');

module.exports = function(options, paths) {

  // for all the blog posts, strip out the front matter and copy remainder of content into markdown files in .tmp
  // take all the front matter and compile it into one big posts.json file
  gulp.task('blog', function() {

    return gulp.src(paths.posts + '/*.md')
      .pipe($.frontMatter())
      // copy posts md files sans frontmatter
      .pipe(gulp.dest(paths.tmpPosts))
      // transform the stream to just pull out the frontMatter property on the file object
      .pipe(through2.obj(function(file, encoding, callback) {
        this.push(file.frontMatter);
        callback();
      }))
      // turn the stream into a json array
      .pipe(JSONStream.stringify('[\n', ',\n', '\n]\n', 2))
      .pipe(fs.createWriteStream(paths.tmpPosts + '/posts.json'))

  });
};
