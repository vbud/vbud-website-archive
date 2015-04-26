'use strict';

/**
 * @ngdoc filter
 * @name <%= appName %>.filter:<%= cameledName %>
 * @description
 */

/* @ngInject */
function <%= cameledName %>() {
  return function (input) {
    return '<%= cameledName %> filter: ' + input;
  };
}

export default <%= cameledName %>;
