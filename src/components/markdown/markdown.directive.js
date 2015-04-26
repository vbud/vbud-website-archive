'use strict';

/* ngInject */
function markdown($sanitize) {

  function link(scope, element) {
    var html = $sanitize( marked(element.text()) );
    element.html(html);
  }

  return {
    restrict: 'E',
    link: link
  };
}

export default markdown;
