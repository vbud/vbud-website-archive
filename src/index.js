'use strict';

import markdown from './components/markdown/markdown.directive';
import posts from './services/posts.factory';
import Nav from './components/nav/nav.controller';
import Home from './pages/home/home.controller';
import Projects from './pages/projects/projects.controller';
import Blog from './pages/blog/blog.controller';

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
      /* @injectRoutes start */
      .state('blog/merciless-pandas', {
        url: '/blog/merciless-pandas',
        templateUrl: 'posts/20150426_merciless-pandas.html'
      })
      .state('blog/autoproxy-bash-goodness', {
        url: '/blog/autoproxy-bash-goodness',
        templateUrl: 'posts/20150427_autoproxy-bash-goodness.html'
      })
      /* @injectRoutes end */

    // add a route for each post in posts.json
    // console.log(posts.metadata);
    // posts.metadata.forEach(function(d) {
    //   $stateProvider
    //     .state(d.route, {
    //       url: '/' + d.route,
    //       templateUrl: 'pages/post/post.html',
    //       controller: function() {
    //         var vm = this;
    //         vm.mdPath = 'posts/' + d.filename;
    //       },
    //       controllerAs: 'vm'
    //     })
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
    .factory('posts', posts)
    .controller('Nav', Nav)
    .controller('Home', Home)
    .controller('Projects', Projects)
    .controller('Blog', Blog)
    .config(config);

})();
