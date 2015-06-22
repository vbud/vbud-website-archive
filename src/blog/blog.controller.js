'use strict';

/**
 * @ngdoc controller
 * @name vbudWebsite.controller:Blog
 * @description
 */

class Blog {
	/* @ngInject */
	constructor($state, postsService) {
		var vm = this;

		vm.posts = postsService.getAllPosts().then(function (posts) {
			vm.posts = posts;
		});

		vm.$state = $state;
	}
}

angular.module('vbudWebsite').controller('Blog', Blog);
