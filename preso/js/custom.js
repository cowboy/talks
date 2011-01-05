

$(function(){

  $('a').live( 'click', function(e){
    $(this)
      .attr( 'target', '_blank' )
      .blur();
  });

});

// SYNTAXHIGHLIGHTER STUFFS

$(function(){

  SyntaxHighlighter.autoloader.apply( null, $.map([
    'applescript @AppleScript',
    'actionscript3 as3 @AS3',
    'bash shell @Bash',
    'coldfusion cf @ColdFusion',
    'cpp c @Cpp',
    'c# c-sharp csharp @CSharp',
    'css @Css',
    'delphi pascal @Delphi',
    'diff patch pas @Diff',
    'erl erlang @Erlang',
    'groovy @Groovy',
    'java @Java',
    'jfx javafx @JavaFX',
    'js jscript javascript preso/js/shBrushJScript.js',
    'perl pl @Perl',
    'php @Php',
    'text plain @Plain',
    'py python @Python',
    'ruby rails ror rb @Ruby',
    'sass scss @Sass',
    'scala @Scala',
    'sql @Sql',
    'vb vbnet @Vb',
    'xml xhtml xslt html @Xml'
  ],function(v){
    return v.replace( /@(\S+)$/, 'preso/sh/scripts/shBrush$1.js' );
  }));

  SyntaxHighlighter.defaults['auto-links'] = false;
  SyntaxHighlighter.defaults.toolbar = false;
  SyntaxHighlighter.defaults['tab-size'] = 2;
  SyntaxHighlighter.defaults['quick-code'] = false;

  SyntaxHighlighter.all();

  $('section').live( 'click', function(e){
    if ( !$(e.target).closest( '.syntaxhighlighter' ).length ) {
      $(this).find('.syntaxhighlighter').removeClass( 'selected' );
    }
  });

  $(document).bind( 'keydown', function(e){
    if ( e.which === 27 ) {
      $( 'section[aria-selected] .syntaxhighlighter.selected' )
        .find( 'div.line' ).andSelf().removeClass( 'selected' );
    }
  });

  $('.preso .syntaxhighlighter')

    // Highlight blocks of code on click.
    .live( 'click', function(e){
      var clicked = $(e.target);
        parent = clicked.closest( '.syntaxhighlighter' ),
        line = clicked.closest( 'div.line' ),
        elems = $( line );

      if ( line.closest( '.gutter' ).length ) { return; }

      if ( $.trim( line.text() ) || $.trim( line.prev().text() ) && $.trim( line.next().text() ) ) {

        $.each( [ 'prev', 'next' ], function(i,v){
          line[ v + 'All' ]().each(function(){
            var elem = $(this);

            if ( !$.trim( elem.text() ) && elem[ v ]().length && !$.trim( elem[ v ]().text() ) ) {
              return false;
            }

            elems = elems.add( elem );
          });
        });
      }

      if ( elems.length > 1 ) {
        parent.find( 'div.line' ).removeClass( 'selected' );
        elems.addClass( 'selected' );

        parent.addClass( 'selected' );

      } else {
        parent.removeClass( 'selected' );
      }
    })
    .live( 'click', function(e){
      if ( $(e.target).closest( '.gutter' ).length ) {
        $(this).toggleClass( 'hover' );
      }
    })
    .live( 'mouseleave', function(e){
      $(this).removeClass( 'hover' );
    });

});


$(function(){

  $('html').addClass( 'preso' );

  $(document).bind( 'keydown', function(e){
    if ( e.which === 80 ) {
      $('html').toggleClass( 'preso no-preso' );
    }
  });

});



(function($){
  // http://gist.github.com/379255
  (function(b){b.event.special.cheat={setup:function(){b(this).bind("keydown",a)},teardown:function(){b(this).unbind("keydown",a)},add:function(c){var f=c.handler,e=c.data,d=[];if(/[a-z]/i.test(e)){e=b.map(e.toUpperCase().split(""),function(g){return g.charCodeAt(0)}).join(" ")}c.handler=function(g,h){d.push(h);if(d.join(" ").indexOf(e)>=0){d=[];f.apply(this,arguments)}}},};function a(c){b(this).triggerHandler("cheat",[c.which])}})(jQuery);


  $(document).bind( 'cheat', 'ben', organ1k );
  $(document).bind( 'cheat', 'boaz', cornify );

  var organ1k_id;
  function organ1k() {
    if ( organ1k_id ) {
      clearInterval( organ1k_id );
      organ1k_id = null;
      $('#organ1k').remove();

    } else {
      $('<canvas id="organ1k"/>').appendTo('body');

      // http://benalman.com/code/projects/js1k-organ1k/organ1k.html
      (function(J){var A,v,F,D,q,n,G=J.body.style,f=J.getElementById("organ1k"),d=f.getContext("2d"),p=32,I=360,e=Math,B=e.min,b=e.sin,c=e.cos,l=e.random,z=e.PI*2,o=z/I,t=0,a=0,C=0,k=0,h=G.margin=0,H=2,s=2,r=3,E=6,g=p,u=[],i=[],m="f001fa01ff0107010ff100f14081e8e".split(1),j=l(G.overflow="hidden")*I,w=l(onmousemove=function(x){g=0;q=x.clientX-F;n=x.clientY-D})<.5?1:-1;organ1k_id=setInterval(function(L,x,K,y,M){if(!(++t%p)){while(k==~~(y=l(M=l())*6));k=~~y;y<.4?w=-w:y<2?h++:y<3?C=M*7:y<4?H=M*8+1:y<5?s=M*3+1:r=B(E=M*8+4,l()*5+5)-2}A=f.width=innerWidth;v=f.height=innerHeight;L=B(F=A/2,D=v/2);x=L/I;L-=20*x;if(++g>p){if(C<1){j-=H*w*4;q=b(j*o)*L;n=c(j*o)*L}else{j-=H*w*2;y=e.abs(q=b(j*o)*L);q=y*c(M=e.atan2(0,q)+j*o/C);n=y*b(M)}}for(K=0;K<p;){y=u[K]=u[K]||{x:0,y:0};M=u[K-1];y.x=K?y.x+(M.x-y.x)/s:q;y.y=K++?y.y+(M.y-y.y)/s:n}for(K=0;y=u[K*4];){i[a++%I]={s:1,d:1,c:m[(h+K++)%8],x:y.x,y:y.y}}d.fillRect(K=0,0,A,v);while(y=i[K++]){M=y.s+=y.d;y.d=M>E?-1:M<r?1:y.d;d.beginPath(d.fillStyle="#"+y.c);d.fill(d.arc(F+y.x,D+y.y,M*x,0,z,0))}},p)})(document)
    }
  };

  var cornify_id;
  function cornify() {
    if ( cornify_id ) {
      clearInterval( cornify_id );
      cornify_id = null;
      $('body > div').remove();

    } else if ( window.cornify_add ) {
      start();

    } else {
      $.getScript( 'http://www.cornify.com/js/cornify.js', function(){
        $('<div id="__cornify_css"/>').appendTo('body');
        cornify_replace = function(){};
        start();
      });
    }

    function start() {
      cornify_id = setInterval( cornify_add, 500 );
    };
  };

})(jQuery);






