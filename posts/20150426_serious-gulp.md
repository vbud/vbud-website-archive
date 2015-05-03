---
title: Getting more serious with gulp
description: Using gulp to iterate over markdown files and store metadata for the web application.
tags: 
- gulp
- markdown
- streams 
---

In order to create this blog, I needed to build a master posts.json file that contains information so that my web app (Angular-based) can consume it. I needed the following information from/about each file:
- front-matter
- file path
- date authored
- route (i.e. a route named "example-post" means I can access the post at vbud.github.io/blog/example-post)


