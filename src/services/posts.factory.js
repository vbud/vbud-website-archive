'use strict';

/* ngInject */
function posts($http) {

  var metadata;

  function init() {
    metadata = $http.get('posts/posts.json').success( function(data) {
      metadata = data;
      console.log(metadata);
    });
  }

  init();

  return {
    get metadata() {
      return metadata;
    }
  };
}

export default posts;
