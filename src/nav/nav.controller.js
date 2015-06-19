'use strict';

/**
 * @ngdoc controller
 * @name vbudWebsite.controller:Nav
 * @description
 */

/* @ngInject */
function Nav() {

  var vm = this;

  vm.links = [
    {
      name: 'Me',
      route: 'home',
      active: false
    },
    {
      name: 'Projects',
      route: 'projects',
      active: false
    },
    {
      name: 'Blog',
      route: 'blog',
      active: false
    }
  ];

}

angular.module('vbudWebsite').controller('Nav', Nav);
