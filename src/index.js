'use strict';

import markdown from './components/markdown/markdown.directive';
import postsService from './services/posts.factory';
import Nav from './components/nav/nav.controller';
import Home from './pages/home/home.controller';
import Projects from './pages/projects/projects.controller';
import Blog from './pages/blog/blog.controller';
import Post from './pages/blog/post/post.controller';

(function () {

  /* @ngInject */
  function config($stateProvider, $urlRouterProvider) {

    // routes
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'pages/home/home.html',
        controller: 'Home',
        controllerAs: 'vm'
      })
      .state('projects', {
        url: '/projects',
        templateUrl: 'pages/projects/projects.html',
        controller: 'Projects',
        controllerAs: 'vm'
      })
      .state('blog', {
        url: '/blog',
        templateUrl: 'pages/blog/blog.html',
        controller: 'Blog',
        controllerAs: 'vm'
      })
        .state('blog.post', {
          url: '/:post',
          templateUrl: 'pages/blog/post/post.html',
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

  angular.module('vbudWebsite', [
      // Angular modules
      'ngSanitize',
      // 3rd-party modules
      'ui.router'
    ])
    .directive('markdown', markdown)
    .factory('postsService', postsService)
    .controller('Nav', Nav)
    .controller('Home', Home)
    .controller('Projects', Projects)
    .controller('Blog', Blog)
    .controller('Post', Post)
    .config(config);

})();
