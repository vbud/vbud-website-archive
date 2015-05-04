---
title: Using gulp for a blog?
description: Using gulp to iterate over markdown files and store metadata for a blog.
tags: 
- gulp
- markdown
- streams
- blog
---

In order to create this blog, I needed to build a JSON file that contains an array of post metadata objects - one object for each blog post file. Then my front-end can consume the posts however it needs to. This way, I can have a generic blog post generator that can be consumed by any front-end.

I needed the following information from/about each file:
- front-matter
  - title
  - description
  - tags
- route (i.e. a route named "example-post" means I can access the post at vbud.github.io/blog/example-post)
- date authored
- filename

I was already using [gulp][gulp] for building, injecting, watching, and serving the front-end. So I added a task named 'blog' that would do the post processing.

You can check out the [full source code of this task][blog task] if you want to just read the code, or you can read on for a walkthrough.


## Walking through the blog task

Gulp is nice because you can easily see what is happening step-by-step from the source files to their final output.

All of my posts are written in markdown with front matter that describes the post. I need to get the front matter data, save it for access later in the stream, strip out the front matter, and copy those markdown files (sans front matter) to a temporary location where I will serve them locally.

Turns out this is super easy with the help of the [gulp-front-matter][gulp-front-matter] package. gulp-front-matter stores the front matter it stripped from the markdown files on the file object in the node stream. We will use it later.

```javascript
gulp.task('blog', function() {

  return gulp.src(paths.posts + '/*.md')
    .pipe(gulpFrontMatter())
    .pipe(gulp.dest('.tmp/serve/posts/'))
```

At the beginning of this post, I described how I need to store an array of post metadata objects - one for each post file - in a JSON file. Doing this with streams was a bit tricky to wrap my head around at first.

Some of the metadata I need comes from the front matter, which I already have available on the file object in the stream. The filename, date, and route, however, all come from the filename, so I parse out information and add it to file object in the stream. Picking up where I left off:

```javascript
    .pipe(through2.obj(function(file, encoding, callback) {
      var route, date;
      // split the filename into the route and date
      var filename = file.relative.replace('.md', '').split('_');
      // should be only one underscore between two strings
      if(filename.length === 2) {
        var metadata = {
          date: dateify(filename[0]),
          route: filename[1],
          filename: file.relative
        };
        // combine the metadata and frontmatter objects into one object
        metadata = _.assign(metadata, file.frontMatter);
        this.push(metadata);
      } else {
        console.warn('Post file ' + file.relative + ' not named correctly.\nFile should be named "[date]_[route].md".\nExample: 20150101_happy-new-year.md');
      }
      callback();
    }))
```

I have some explaining to do. First I use [through2][through2] to transform the stream - this gives me access to the stream. Most gulp plugins do something like this to perform their operations on your files.

I parse out the date and route from the filename, grab the filename, and merge the date with the front matter data given to us by gulp-front-matter into one `metadata` object.

And then it gets interesting. I want to modify the stream so that the output of this `pipe` to the stream is just this `metadata` object. The `this.push(metadata)` line does this.

Now I have transformed the stream and am churning out post metadata! I then get it into a JSON file with the handy [JSONStream][JSONStream] package, which has a `stringify` method that streams the objects in the stream to a JSON string.

```javascript
.pipe(JSONStream.stringify('[\n', ',\n', '\n]\n', 2))
```

Now the stream just carries a JSON stream, which can be easily piped into the JSON file I was looking for:

```javascript
.pipe(fs.createWriteStream('.tmp/posts/posts.json'))
```

Putting it all together:

```javascript
gulp.task('blog', function() {

  return gulp.src(paths.posts + '/*.md')
    .pipe($.frontMatter())
    // copy posts md files sans frontmatter
    .pipe(gulp.dest(paths.tmpPosts))
    .pipe(through.obj(function(file, encoding, callback) {
      var route, date;
      // split the filename into the route and date
      var filename = file.relative.replace('.md', '').split('_');
      // should be only one underscore between two strings
      if(filename.length === 2) {
        var metadata = {
          date: dateify(filename[0]),
          route: filename[1],
          filename: file.relative
        };
        // combine the metadata and frontmatter objects into one object
        metadata = _.assign(metadata, file.frontMatter);
        this.push(metadata);
      } else {
        console.warn('Post file ' + file.relative + ' not named correctly.\nFile should be named "[date]_[route].md".\nExample: 20150101_happy-new-year.md');
      }
      callback();
    }))
    // turn the stream into a json array
    .pipe(JSONStream.stringify('[\n', ',\n', '\n]\n', 2))
    .pipe(fs.createWriteStream(paths.tmpPosts + '/posts.json'))
```

Again, feel free to check out the [full source code of this task][blog task]. I changed a few things in the code in the post for readability/clarity.


## Wait, why are you doing this again?

As a disclaimer here - I'm not sure if this is the best approach to a blog/site generator. I wanted a way to write posts into markdown files with front matter that would allow a web app to consume the posts, and I achieved that :). I may not end up doing this long-term, but for now this works pretty well.



[gulp]: https://github.com/gulpjs/gulp
[blog task]: https://github.com/vbud/vbud.github.io/blob/working/gulp/blog.js
[gulp-front-matter]: https://www.npmjs.com/package/gulp-front-matter
[through2]: https://www.npmjs.com/package/through2
[JSONStream]: https://www.npmjs.com/package/JSONStream
