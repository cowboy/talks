/*
 * jQuery hashchange event - v1.3 - 7/21/2010
 * http://benalman.com/projects/jquery-hashchange-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function($,e,b){var c="hashchange",h=document,f,g=$.event.special,i=h.documentMode,d="on"+c in e&&(i===b||i>7);function a(j){j=j||location.href;return"#"+j.replace(/^[^#]*#?(.*)$/,"$1")}$.fn[c]=function(j){return j?this.bind(c,j):this.trigger(c)};$.fn[c].delay=50;g[c]=$.extend(g[c],{setup:function(){if(d){return false}$(f.start)},teardown:function(){if(d){return false}$(f.stop)}});f=(function(){var j={},p,m=a(),k=function(q){return q},l=k,o=k;j.start=function(){p||n()};j.stop=function(){p&&clearTimeout(p);p=b};function n(){var r=a(),q=o(m);if(r!==m){l(m=r,q);$(e).trigger(c)}else{if(q!==m){location.href=location.href.replace(/#.*/,"")+q}}p=setTimeout(n,$.fn[c].delay)}$.browser.msie&&!d&&(function(){var q,r;j.start=function(){if(!q){r=$.fn[c].src;r=r&&r+a();q=$('<iframe tabindex="-1" title="empty"/>').hide().one("load",function(){r||l(a());n()}).attr("src",r||"javascript:0").insertAfter("body")[0].contentWindow;h.onpropertychange=function(){try{if(event.propertyName==="title"){q.document.title=h.title}}catch(s){}}}};j.stop=k;o=function(){return a(q.location.href)};l=function(v,s){var u=q.document,t=$.fn[c].domain;if(v!==s){u.title=h.title;u.open();t&&u.write('<script>document.domain="'+t+'"<\/script>');u.close();q.location.hash=v}}})();return j})()})(jQuery,this);

(function($){

  var win = $(window),
      hash,
      max,
      style,
      styleProp;

  win
    .hashchange(function(e){
      hash = location.hash.replace( /^#/, '' ) || 1;

      var last = $('section[aria-selected]'),
          next = $('body > section').eq( hash - 1 ),
          tmp;

      if ( last ) {
        last.removeAttr( 'aria-selected' );
        if ( tmp = last.data( 'onunload' ) ) {
          window[ tmp ].call( last );
        }
      }

      if ( next ) {
        next.attr( 'aria-selected', 'true' );
        if ( tmp = next.data( 'onunload' ) ) {
          window[ tmp ].call( next );
        }
      }

      $('#index .pagenumber').html( hash );
    })
    .resize(function(){
      if ( !style ) {
        if ( $.browser.msie ) { // ie is awesome
          style = document.createStyleSheet();
          styleProp = 'cssText';
        } else {
          style = $('<style rel="stylesheet" type="text/css"/>')[0];
          styleProp = typeof document.body.style.WebkitAppearance === 'string' ? 'innerText' : 'innerHTML';
        }

        $(style).appendTo( 'head' );
      }

      style[ styleProp ] = 'body > section > div { height: ' + win.height() +'px; }';
    })
    .keydown(function(e){
      var keyCode = e.keyCode,
          newHash;

      if ( e.altKey || e.ctrlKey || e.metaKey || e.shiftKey ) {
        return;
      }

      if ( keyCode === 37 ) {
        newHash = +hash - 1;
      } else if ( keyCode == 32 || keyCode == 39 ) {
        newHash = +hash + 1;
      }

      if ( newHash !== undefined ) {
        if ( newHash && newHash <= max ) {
          location.hash = '#' + newHash;
        }
        e.preventDefault();
      }
    })

    $(function(){
      var slides = $('body > section'),
          title = $('title').text();

      max = slides.length;

      slides.each(function(){
        $(this).wrapInner( '<div/>' );
      });

      $('<footer id="footer"/>')
        .html(
          '<div class="flex-wrapper"><p>' + title + '</p>' +
          '<p class="flex-space"></p>' +
          '<p id="index"><span class="pagenumber"></span> / ' + max +'</p>'
        )
        .appendTo( 'body' );

      win.hashchange().resize();
    });
})(jQuery);
