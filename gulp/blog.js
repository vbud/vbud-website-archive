'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var fs = require('fs');
var es = require('event-stream');

module.exports = function(options, paths) {

  // for all the blog posts, strip out the front matter and copy remainder of content into markdown files in .tmp
  // take all the front matter and compile it into one big posts.json file
  gulp.task('blog', function() {

    return gulp.src(paths.posts + '/*.md')
      .pipe($.frontMatter())
      .pipe(gulp.dest(paths.tmpPosts)) // copy posts md files sans frontmatter
      .pipe(es.map(function(file, cb) {
        cb(null, JSON.stringify(file.frontMatter, null, 2) + ',\n');
      }))
      // .pipe(es.stringify())
      // .pipe(es.wait(function(err, body) {
      //   console.log(JSON.stringify(body, null, 2));
      // }))
      .pipe(fs.createWriteStream(paths.tmpPosts + '/posts.json'))

  });
};
