/*!
 * jQuery Enumerate - v1.0 - 1/2/2011
 * http://benalman.com/
 * 
 * Copyright (c) 2011 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */

(function($){

  $.fn.enumerate = function(start) {
    if (typeof start !== "number") {
      start = 1;
    }
    return this.each(function(i) {
      $(this).prepend((start + i) + ". ");
    });
  };

}(jQuery));
