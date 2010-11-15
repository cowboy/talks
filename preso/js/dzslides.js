
/*
************************************
*                                  *
*            JAVASCRIPT            *
*  (You don't have to read this)   *
************************************
*/

function init() {
  var firstFrame = window.location.hash? parseInt(window.location.hash.split("#")[1], 10) : 1;
  var title = document.querySelector("title").textContent;
  var slides = document.querySelectorAll("body > section");
  for (var i = 1, il = slides.length; i <= il; i++) {
    // FIXME : Mandatory for flex box model for vertical align
    // Firefox bug :(
    slides[i - 1].innerHTML = "<div>" + slides[i - 1].innerHTML + "</div>";
    
    var h = document.querySelector("section:nth-of-type("+ i +") > div > :first-child");
    var t = title + ' - ' + $(h).text() + ' [' + i + '/' + il + ']';
    
    window.history[(i == 1? 'replace' : 'push') + 'State'](i, t, "#"+i);
    document.title = t;
  }
  
  document.title = title;

  var footer = document.createElement("footer");
  footer.id = "footer";
  footer.innerHTML = 
    '<div class="flex-wrapper"><p>' + title + '</p>' +
    '<p class="flex-space"></p>' + 
    '<p id="index"><span class="pagenumber"></span> / ' + il +'</p>';
  document.body.appendChild(footer);
  history.go(- slides.length + firstFrame);


  window.addEventListener("popstate", function(e) {
    if(e.state) {
      var old = document.querySelector("section[aria-selected]");
      var next = document.querySelector("section:nth-of-type("+ e.state +")");

      if (old) {
        old.removeAttribute("aria-selected");
        if (old.hasAttribute("data-onunload")) {
          window[old.getAttribute("data-onunload")].call(window, old);
        }
      }

      if (next) {
        next.setAttribute("aria-selected", "true");
        if (next.hasAttribute("data-onload")) {
          window[next.getAttribute("data-onload")].call(window, next);
        }
      }


      var index = document.querySelector("#index .pagenumber");
      index.innerHTML = e.state;
    }
  }, true); 
}

function resize() {
  var style = document.getElementById("resizeStyle");
  if (!style) {
    style = document.createElement("style");
    style.id = "resizeStyle";
    document.head.appendChild(style);
  }
  style.textContent = "body>section>div {height: "+ window.innerHeight +"px}";
}

window.addEventListener("resize", resize, true);
window.addEventListener("load", resize, true);
window.addEventListener("load", init, true);

// Webkit bug
// window.addEventListener("hashchange", init, true); // FIXME Webkit fires hashchange when it shouldn't
window.addEventListener("keydown", function(e) {
  // Don't intercept keyboard shortcuts
  if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) {
    return;
  }
  if (   /*e.keyCode == 80 // p
      || e.keyCode == 66 // b
      ||*/ e.keyCode == 37 // left arrow
      //|| e.keyCode == 33 // page up
  ) {
    e.preventDefault();
    history.back();
  }
  if (   /*e.keyCode == 78 // n
      ||*/ e.keyCode == 32 // space
      || e.keyCode == 39 // right arrow
      //|| e.keyCode == 34 // page down
  ) {
    e.preventDefault();
    history.forward();
  }
}, true);
