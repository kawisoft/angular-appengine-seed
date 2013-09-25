'use strict';

// Directives are HTML template building blocks. If the built in directives
// provided by Angular are not enough, or for convenience, it is possible to
// create your own.
angular.module('seed.directives', []).
  // Create a link to the API. Assumes usage in an anchor tag. Specify optional
  // item id as the attribute value. Replaces the href element attribute.
  // <a seed-href>...</a>
  // <a seed-href="10">...</a>
  directive('seedHref', ['Config', function(Config) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var href = [Config.api_url, attrs.seedHref].filter(function(value) {
          return '' != value;
        }).join('/');

        element.attr('href', href);
      }
    };
  }]).
  // Display API path. Replaces the element text value.
  // <span seed-api></span>
  // <span seed-api="10"></span>
  directive('seedApi', ['Config', function(Config) {
    return {
      restrict: 'A',  
      link: function(scope, element, attrs) {
        var href = [Config.api_url, attrs.seedApi].filter(function(value) {
          return '' != value;
        }).join('/');

        element.text(href);
      }
    };
  }]);