'use strict';

/* @ngInject */
function markdown($sanitize) {

  function link(scope, element) {
    marked.setOptions({
      highlight: function (code, lang) {
        // if no language is provided in code block, or something else has gone wrong, attempt to auto-detect
        if(typeof lang !== 'string')
          return hljs.highlightAuto(code).value;

        // otherwise use the language specified
        return hljs.highlight(lang, code).value;
      }
    });
    var html = $sanitize( marked(element.text()) );
    element.html(html);
  }

  return {
    restrict: 'E',
    link: link
  };
}

angular.module('vbudWebsite').directive('markdown', markdown);
