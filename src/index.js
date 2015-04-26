'use strict';

import Nav from './components/nav/nav.controller';
import Home from './pages/home/home.controller';
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
      .state('blog', {
        url: '/blog',
        templateUrl: 'pages/blog/blog.html',
        controller: 'Blog',
        controllerAs: 'vm'
      });

    $urlRouterProvider.otherwise('/');

  }

  angular.module('vbudWebsite', [
      // Angular modules
      'ngSanitize',
      // 3rd-party modules
      'ui.router'
    ])
    .controller('Nav', Nav)
    .controller('Home', Home)
    .controller('Blog', Blog)
    .config(config);

})();
