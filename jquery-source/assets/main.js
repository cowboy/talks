function highlight(code){
   code = code.replace(/^\t+/gm, function(m){return Array(m.length+1).join('   ')}); // change tabs to spaces (3)
   var elem = document.createElement("span");
   elem.appendChild( document.createTextNode(code) );
   (new WebInspector.DOMSyntaxHighlighter("text/javascript")).syntaxHighlightNode(elem);
   return elem;
}

function lineViewer(num, start){
   var i = start || 1, e = 0;
   return (
      '<ul style="list-style-type: none; padding: 0; margin: 0" class="text-editor-lines">' +
      Array(num+1).join(
         '<li class="webkit-line-number" id="$$">' +
            '<div class="webkit-line-number-outer">' +
               '<a href="#$$">' +
                  '<span class="webkit-line-number-inner">$$</span>' +
               '</a>' +
            '</div>' +
         '</li>'
      ).replace(/\$\$/g, function(m){ return ++e==3 ? (e=0,i++) : i; }) +
      '</ul>'
   );
}

window.onload = function(){
  var pre     = document.body.firstChild;
  var content = pre; //document.createElement('div');
      content.className = "viewer-content";
  var sidebar = document.createElement('div');
      sidebar.className = "viewer-line-numbers";
  var text    = pre.textContent;

  pre.textContent   = text.replace(/\t+/g, function(m){ return Array(m.length+1).join('   ') });
  sidebar.innerHTML = lineViewer(1, text.split('\n').length+1);

  document.body.insertBefore(sidebar, pre);

  var tmp = sidebar.firstChild.firstChild;
  tmp.style.height  = pre.parentNode.offsetHeight + "px";
  tmp.style.width   = getComputedStyle(tmp, null).width;
  tmp.innerHTML = "";
  
  /* delay a bit to give browser some time to render the blank lines-sidebar and plain source */
  setTimeout(function(){
    sidebar.innerHTML = lineViewer(text.split('\n').length);
    
    if(scrollToElem = document.getElementById(location.hash.slice(1)))
        scrollToElem.scrollIntoView();
  
    var code  = pre.firstChild, // what if the browser creates more than one text node?
        lines = code.textContent.split(/\n/), i = 0,
        start = Date.now(),
        scrollToElem;   // mmm, variable hoisting
  
    /* 3... 2.. 1. */
    (function doit(){
      var text    = lines.slice(i, i+=100),
          offset  = text.join('\n').length+1,
          node    = document.createElement('span'), _code;
  
      if(!text[0])
          text[0] = ' ';
      text  = text.join('\n').replace(/\r/g, '')+'\n';
  
      node.appendChild(document.createTextNode(text));
  
      (new WebInspector.DOMSyntaxHighlighter("text/javascript")).syntaxHighlightNode(node);
      
      if(code.textContent.length > offset) {
        _code = code.splitText(offset);
      } else {
        _code = code.nextSibling;
      }
      code.parentNode.replaceChild(node, code);
  
      code = _code;
      if(lines.length > i)
        setTimeout(doit, 12);
      else if(code){
        lines = code.textContent.split(/\n/), i = 0;
        setTimeout(doit, 12);
      }else{
        /* boom */
        if(typeof console != 'undefined')
          console.log("Done in ", Date.now()-start, "ms.");
      }
    })();
  }, 300);
};