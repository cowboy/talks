/**
 * SyntaxHighlighter
 * http://alexgorbatchev.com/SyntaxHighlighter
 *
 * SyntaxHighlighter is donationware. If you are using it, please donate.
 * http://alexgorbatchev.com/SyntaxHighlighter/donate.html
 *
 * @version
 * 3.0.83 (July 02 2010)
 * 
 * @copyright
 * Copyright (C) 2004-2010 Alex Gorbatchev.
 *
 * @license
 * Dual licensed under the MIT and GPL licenses.
 */
;(function()
{
  // CommonJS
  typeof(require) != 'undefined' ? SyntaxHighlighter = require('shCore').SyntaxHighlighter : null;

  function Brush() {
    var keywords = 'break case catch continue ' +
      'default delete do else ' +
      'for function if in instanceof ' +
      'new return super switch ' +
      'throw try typeof var while with document window';
    
    var re_operators = /!|%|&amp;|\*|\-\-|\-|\+\+|\+|~|===|==|=|!=|!==|&lt;=|&gt;=|&lt;&lt;=|&gt;&gt;=|&gt;&gt;&gt;=|&lt;&gt;|&lt;|&gt;|!|&amp;&amp;|\|\||\?|:|\*=|\/=|%=|\+=|\-=|&=|\^=/gm;
    
    var constants = 'Infinity NaN undefined true false null',
      re_number = /\b((0(x|X)[0-9a-fA-F]+)|([0-9]+(\.[0-9]+)?))\b/gm,
      re_punctuation = /[{}()[\],.;]/gm,
      re_regexp = /\/(\\\/|.)*?\/[igm]*/gm;
    
    var r = SyntaxHighlighter.regexLib;
    
    this.regexList = [
      { regex: r.multiLineDoubleQuotedString,          css: 'string' },      // double quoted strings
      { regex: r.multiLineSingleQuotedString,          css: 'string' },      // single quoted strings
      { regex: r.singleLineCComments,              css: 'comments' },      // one line comments
      { regex: r.multiLineCComments,              css: 'comments' },      // multiline comments
      { regex: /\s*#.*/gm,                  css: 'preprocessor' },    // preprocessor tags like #region and #endregion
      { regex: new RegExp(this.getKeywords(keywords), 'gm'),  css: 'keyword' },      // keywords
      { regex: new RegExp(this.getKeywords('this'), 'gm'), css: 'this' },
      { regex: new RegExp(this.getKeywords(constants), 'gm'), css: 'variable' },
      { regex: re_number, css: 'variable' },
      { regex: re_regexp, css: 'value' },
      { regex: re_operators, css: 'comments' },
      { regex: re_punctuation, css: 'comments' },
      ];
  
    this.forHtmlScript(r.scriptScriptTags);
  };

  Brush.prototype  = new SyntaxHighlighter.Highlighter();
  Brush.aliases  = ['js', 'jscript', 'javascript'];

  SyntaxHighlighter.brushes.JScript = Brush;

  // CommonJS
  typeof(exports) != 'undefined' ? exports.Brush = Brush : null;
})();

/*

plain
comments
string
keyword
preprocessor
variable
value
functions
constants
script
color1
color2
color3

*/

function xxx(){
  Sound.prototype = {
    play: function() {},
    "play": function() {}
  };
  Sound.prototype.play = function( arg1, arg2, arg3 ) {};
  Sound.play = function() {};
  var play = function() {};
  function play( arg ) {};
  var s = new Sound();
  $(function(){
    $(this).css( 'foo', "bar" );
    var arr = [ 1, null, 'foo', /xyz/gi, /x\\\/123+/g, "bar", Infinity, NaN ];
    m = u.match( x ? /^([^#]*)\#?(.*)$/ : /^([^#?]*)\??([^#]*)(#?.*)/ );
    var a = Array() || String() || void( 1 + 2 );
    a = b ? c : 1;
    d += ( a + 1 ) * 3 / 4 % 5 || g++ && --d || true && false && undefined;
    for ( var i = 1, j = 2; i < 100; i++ ) {
      if ( j % 2 ) {
        continue;
      }
    }
    if ( s['foo'] ) {
      delete s.foo;
      return;
    }
  });
};

/*

<pre class="brush:js class-name:l20">
  Sound.prototype = {
    play: function() {},
    "play": function() {}
  };
  Sound.prototype.play = function( arg1, arg2, arg3 ) {};
  Sound.play = function() {};
  var play = function() {};
  function play( arg ) {};
  var s = new Sound();
  $(function(){
    $(this).css( 'foo', "bar" );
    var arr = [ 1, null, 'foo', /xyz/gi, /x\\\/123+/g, "bar", Infinity, NaN ];
    m = u.match( x ? /^([^#]*)\#?(.*)$/ : /^([^#?]*)\??([^#]*)(#?.*)/ );
    var a = Array() || String() || void( 1 + 2 );
    a = b ? c : 1;
    d += ( a + 1 ) * 3 / 4 % 5 || g++ && --d || true && false && undefined;
    for ( var i = 1, j = 2; i < 100; i++ ) {
      if ( j % 2 ) {
        continue;
      }
    }
    if ( s['foo'] ) {
      delete s.foo;
      return;
    }
  });
</pre>

*/
