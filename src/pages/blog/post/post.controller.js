'use strict';

class Post {
  /* @ngInject */
  constructor ($stateParams, postsService) {
    var vm = this;

    postsService.getPostByRoute($stateParams.post).then(function(post) {
      vm.post = post;
    })
  }
}

export default Post;
