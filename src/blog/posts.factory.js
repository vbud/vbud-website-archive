'use strict';

/* @ngInject */
function postsService($http) {

	var getPosts = $http.get('blog/posts/posts.json', {cache: true});

	//TODO: we may want to move this all to the run block so all the posts are downloaded and processed once
	return {
		getAllPosts: function () {
			return getPosts.then(function (result) {
				return result.data;
			});
		},
		getPostByRoute: function (route) {
			return getPosts.then(function (result) {
				return _.find(result.data, {route: route});
			});
		}
	};
}

angular.module('vbudWebsite').factory('postsService', postsService);
