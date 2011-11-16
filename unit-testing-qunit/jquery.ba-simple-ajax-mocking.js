/*!
 * Simple jQuery (1.5+) AJAX Mocking - v0.1pre - 11/16/2011
 * http://benalman.com/
 * 
 * Copyright (c) 2011 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */

(function($) {

  function processRules(options) {
    var transport;
    $.each($.mockAjax.rules[options.dataType], function(k, rule) {
      var matches = options.url.match(rule.re);
      if (matches) {
        transport = {
          send: function(_, done) {
            var response = rule.response;
            if ($.isFunction(response)) {
              response = response(matches, options);
            }
            done("200", "success", {status: JSON.stringify(response)});
          },
          abort: $.noop
        };
        return false;
      }
    });
    return transport;
  }

  $.mockAjax = function(dataType, userRules) {
    var rules = $.mockAjax.rules[dataType];

    if (!rules) {
      rules = $.mockAjax.rules[dataType] = {};
      $.ajaxTransport(dataType, processRules);
    }

    $.each(userRules, function(pattern, response) {
      rules[pattern] = {
        re: new RegExp("^" + pattern + "$"),
        response: response
      };
    });
  };

  $.mockAjax.rules = {};

}(jQuery));
