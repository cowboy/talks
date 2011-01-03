/*!
 * jQuery Enumerate - v1.0 - 1/2/2011
 * http://benalman.com/
 * 
 * Copyright (c) 2011 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */

(function($){

  $.fn.enumerate = function( start ) {
    start = start || 0;
    return this.each(function(i){
      $(this).prepend( ( i + start ) + '. ' );
    });
  };

})(jQuery);
