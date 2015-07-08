'use strict';

var gulp = require('gulp');
var $ = {
	frontMatter: require('gulp-front-matter'),
	markdown: require('gulp-markdown')
};

var _ = require('lodash');
var hljs = require('highlight.js');
var fs = require('fs');
var mkdirp = require('mkdirp');
var through = require('through2');
var JSONStream = require('JSONStream');
var browserSync = require('browser-sync');

var config = require('./config');
var paths = config.paths;


// takes a string of the form yyyymmdd and turns it into a date object
function dateify(date) {
	if (typeof date !== 'string' || date.length !== 8) {
		// `date` is malformed, return the current time instead
		return new Date();
	}
	var y, m, d;
	y = parseInt(date.substring(0, 4));
	m = parseInt(date.substring(4, 6)) - 1; //month is zero-based >_<
	d = parseInt(date.substring(6));
	return new Date(y, m, d);
}

var markedOptions = {
	highlight: function (code, lang) {
		// if no language is provided in code block, or something else has gone wrong, attempt to auto-detect
		if (typeof lang !== 'string')
			return hljs.highlightAuto(code).value;

		// otherwise use the language specified
		return hljs.highlight(lang, code).value;
	}
};


// for all the blog posts, strip out the front matter and copy remainder of content into markdown files in .tmp
// take all the frontmatter from the posts, take date and route from post filename, and compile it into one big posts.json file
gulp.task('prepare-blog-posts', prepareBlogPosts);
function prepareBlogPosts() {

	// create the tmp posts directory if it does not already exist
	// TODO: should do this at the last pipe below where we fs.createWriteStream
	// OR: use async mkdirp and have the rest of task 'blog' execute once it's finished (similar to 'clean' task)
	mkdirp.sync(paths.tmpPosts);

	return gulp.src(paths.posts + '/*.md')
		.pipe($.frontMatter())
		// compile md files, sans frontmatter, to html
		.pipe($.markdown(markedOptions))
		.pipe(gulp.dest(paths.tmpPosts))
		// transform the stream to just pull out the frontMatter property on the file object
		.pipe(through.obj(function (file, encoding, callback) {
			var route, date;
			// split the filename into the route and date
			var splitFilename = file.relative.replace('.html', '').split('_');
			if (splitFilename.length === 2) {
				var metadata = {
					date: dateify(splitFilename[0]),
					route: splitFilename[1],
					filename: file.relative,
					path: paths.posts.replace('src/', '') + '/' + file.relative
				};
				// combine the metadata and frontmatter objects into one object
				metadata = _.assign(metadata, file.frontMatter);
				//console.log(metadata);
				this.push(metadata);
			} else {
				console.warn('Post file ' + file.relative + ' not named correctly.\nFile should be named "[date]_[route].md".\nExample: 20150101_happy-new-year.md');
			}
			callback();
		}))
		// turn the stream into a json array
		.pipe(JSONStream.stringify('[\n', ',\n', '\n]\n', 2))
		.pipe(fs.createWriteStream(paths.tmpPosts + '/posts.json'));
}


// compile all markdown files except for posts, which are handled in `prepareBlogPosts`
gulp.task('compile-other-markdown', compileOtherMarkdown);
function compileOtherMarkdown() {
	return gulp.src([
		paths.src + '/**/*.md',
		'!' + paths.posts + '/*.md'
	])
		.pipe($.markdown(markedOptions))
		.pipe(gulp.dest(paths.tmpServe));
}

gulp.task('blog', ['prepare-blog-posts', 'compile-other-markdown']);

gulp.task('blog:reload', ['blog'], function() {
	browserSync.reload();
});

//module.exports = blog;
