'use strict';

/* @ngInject */
function config($stateProvider, $urlRouterProvider) {

	// routes
	$stateProvider
		.state('home', {
			url: '/',
			templateUrl: 'home/home.html',
			controller: 'Home',
			controllerAs: 'vm'
		})
		.state('projects', {
			url: '/projects',
			templateUrl: 'projects/projects.html',
			controller: 'Projects',
			controllerAs: 'vm'
		})
		.state('blog', {
			url: '/blog',
			templateUrl: 'blog/blog.html',
			controller: 'Blog',
			controllerAs: 'vm'
		})
		.state('blog.post', {
			url: '/:post',
			templateUrl: 'blog/post/post.html',
			controller: 'Post',
			controllerAs: 'vm'
		})
	// .state('blog/post', {
	//   url: '/blog/:post',
	//   templateUrl: 'pages/blog/post/post.html',
	//   controller: 'Post',
	//   controllerAs: 'vm'
	// })

	$urlRouterProvider.otherwise('/');

}

angular.module('vbudWebsite').config(config);
