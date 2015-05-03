'use strict';

/* ngInject */
function postsService($http) {

  function processPost(post) {
    post.path = 'posts/' + post.filename;
    return post;
  }
  function processPosts(posts) {
    posts.forEach(function(post) {
      processPost(post);
    })
    return posts;
  }
  //TODO: we may want to move this all to the run block so all the posts are downloaded and processed once
  return {
    getAllPosts: function() {
      return $http.get('posts/posts.json', {cache: true}).then(function(result) {
        return processPosts(result.data);
      });
    },
    getPostByRoute: function(route) {
      return $http.get('posts/posts.json', {cache: true}).then(function(result) {
        return processPost(_.find(result.data, {route: route}));
      })
    }
  };
}

export default postsService;
