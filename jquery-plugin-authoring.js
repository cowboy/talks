// ============================================================================
// About Me.
// ============================================================================

var cowboy = {
  name:     "Ben Alman",
  url:      "http://benalman.com/",
  twitter:  "@cowboy",
  github:   "cowboy",

  work:     ["      __                                           ",
             "     |  |--..-----..----..-----..--.--..-----.     ",
             "     |  _  ||  _  ||  __||  _  ||  |  ||  _  |     ",
             "     |_____||_____||____||_____||_____||   __|     ",
             "                                       |__|        "].join("\n"),
  title:    "Director of Training and Pluginization",
  workurl:  "http://bocoup.com/",

  plugins:  ["BBQ", "doTimeout", "equalizeBottoms", "getObject", "Star Wipe",
             "hashchange event", "Tiny Pub/Sub", "throttle / debounce", "iff",
             "longUrl", "cond", "Message Queuing", "Misc plugins", "Random",
             "outside events", "postMessage", "replaceText", "resize event",
             "Untils", "unwrap", "URL Utils", "urlInternal", "sortObject",
             "deparam", "infiniteScroller", "scrollinout event", "Sphere 3D",
             "Farthest Decendant", "Data+", "Detach+", "oneOnly", "queueFn",
             "seq", "Floating Scrollbar", "Widget Bootstrap", "bindAndTrigger",
             "nodetype filter", "liveOne", "scrollable selector"],

  articles: ["The \"catch\" with try-catch",
             "Immediately-Invoked Function Expression (IIFE)",
             "Schrecklichwissen: Terrible Knowledge",
             "Partial Application in JavaScript",
             "Cooking BBQ: the original recipe",
             "jQuery special events",
             "There's no such thing as a \"JSON Object\"",
             "On licensing my code",
             "John Resig: JavaScript's Chuck Norris",
             "The Mysterious Firefox setTimeout \"Lateness\" argument™"]
};

// FWIW
cowboy.plugins.length // 39


// ============================================================================
// What's a jQuery Plugin?
// ============================================================================

// Note to self: talk about this for 30 seconds. Try not to ramble.


// ============================================================================
// IIFE = Immediately Invoked Function Expression
// ============================================================================

// Function Declaration.
function foo(a) { console.log("foo " + a); }
foo(1); // "foo 1"

// Function Expression.
var bar = function(a) { console.log("bar " + a); }
bar(2); // "bar 2"


// Without the parens, the IIFE is broken.
function(a) { console.log("broken " + a); }(3); // SyntaxError

// But with the parens, the IIFE works.
(function(a) { console.log("awesome " + a); }(4)); // "awesome 4"


// The "jQuery plugin" IIFE
(function($) {

  console.log("OMG IM IN AN IIFE");

  // Vars and functions are local to the IIFE.
  var myLocalVar = "hello";

  function myLocalFunction() {
    return myLocalVar + " world";
  }

  // A "static" jQuery method
  $.myplugin = function() {
    // Your code goes here.
  };

  // A "collection" jQuery method
  $.fn.myplugin = function() {
    // Your code goes here.
  };

}(jQuery));


// What are the alternatives to using an IIFE?

// If your user had to use $.noConflict() to get jQuery to work with
// Prototype, congratulations. You've just created a Prototype plugin.
$.fn.myplugin = function() {
  // Your code goes here.
};

// Also...
var myLocalVar = "This is really a global var";

// Of course, you can just use `jQuery` everywhere, just don't miss a spot!
jQuery.fn.myplugin = function() {
  $.whoops() // I missed a `$`, let the tickets roll in!
};


// ============================================================================
// What's `this` inside a "collection" Method?
// ============================================================================

(function($) {

  $.fn.test = function() {
    // this === the jQuery object
  };

  $("div").test(); // Inside the function, this === $("div")

  // Not to be confused with:

  $("div").each(function() {
    // this === the DOM element.
  });

}(jQuery));


// ============================================================================
// Chainable Methods
// ============================================================================

(function($) {

  $.fn.href = function(href) {
    this.prop("href", href);
  };

  $("a").href("/test"); // This works.
  $("a").href("/test").addClass("not-gonna-work"); // TypeError, whoops!

}(jQuery));


// So, how do we chain?

(function($) {

  $.fn.href = function(href) {
    this.prop("href", href);
    return this; // returning "this" makes any method chainable!
  };

  $("a").href("/test"); // This works.
  $("a").href("/test").addClass("gonna-work"); // This works now!

  // Because jQuery#prop is a chainable method, you can just do this.
  $.fn.href = function(href) {
    return this.prop("href", href);
  };

}(jQuery));


// ============================================================================
// Implicit (and Explicit) Iteration
// ============================================================================

(function($) {

  // We all know this, right?
  $("p").html("hello world"); // Set innerHTML of every selected element.
  $("p").html(); // "hello world" (get innerHTML of first selected element).

  // But what's the problem with this?
  $("p").html($("p").html() + "!!!");


  // We can solve this problem in two ways.

  // This is the preferred way (since jQuery 1.4):
  $("p").html(function(index, current) {
    return current + "!!!";
  });

  // This is the explicit way, using jQuery#each:
  $("p").each(function() {
    $(this).html($(this).html() + "!!!");
  });


  // jQuery plugins need to explicitly iterate, so users don't have to!

  // This is just plain wrong.
  $.fn.yell = function() {
    return this.html(this.html() + "!!!");
  };

  $("p").yell(); // Not gonna do what you want it to.


  // This is much better.
  $.fn.yell = function() {
    return this.each(function() {
      $(this).html($(this).html() + "!!!");
    });
  };

  $("p").yell(); // Works just like you'd expect.

}(jQuery));

// ============================================================================
// Setters & Getters
// ============================================================================

(function($) {

  // This works as both getter and setter, because a built-in jQuery method
  // is used internally.
  $.fn.href = function(href) {
    return this.prop("href", href);
  };

  $("a").href("/test"); // Set href property of every selected element.
  $("a").href(); // "/test" (get href property of first selected element)


  // What if we weren't using a built-in jQuery method?
  $.fn.href = function(href) {
    if (href == null) {
      // Get the current href property of the first selected element.
      return this.get(0).href;
    } else {
      // Set the current href property of all selected elements.
      return this.each(function() {
        this.href = href;
      });
    }
  };

}(jQuery));

// ============================================================================
// Traversal / Filtering methods that are .end()-able
// ============================================================================

(function($) {

  // Have you ever used the jQuery#end method?
  $("ul").children().addClass("lis").end().addClass("uls");


  // How do you create your own .end()-able method?

  // If you're using a jQuery method internally, it's easy.
  $.fn.spans = function() {
    return this.find("spans");
  };

  // Awesome!
  $("div").spans().addClass("spans").end().addClass("divs");


  // But what if things get a little more.. complicated?
  $.fn.cousins = function() {
    return this.parent().siblings().children();
  };

  // Whoops! jQuery#end only reverts to the previous set
  $("div").cousins().addClass("cousins").end().addClass("aunts-n-uncles");


  // Let's do this the right way, using jQuery.pushStack.
  $.fn.cousins = function() {
    return this.pushStack(this.parent().siblings().children());
  };

  // Much better.
  $("div").cousins().addClass("cousins").end().addClass("divs");

}(jQuery));

// ============================================================================
// A few other .end()-able method patterns.
// ============================================================================

(function($) {

  // Filter the current set of nodes down to just text nodes.
  $.fn.textnodes = function() {
    return this.filter(function() {
      return this.nodeType === 3;
    });
  };

  // Traverse from the current set of elements.
  $.fn.firstChild = function() {
    return this.map(function() {
      // Add some DOM element or array of DOM elements to the result set.
      return this.firstChild;
    });
  };

  // For this method, jQuery#pushStack would have been a better choice.
  $.fn.cousins = function() {
    return this.map(function() {
      // Lots of unnecessary traversal.
      return $(this).parent().siblings().children().get();
    });
  };

})(jQuery);

// ============================================================================
// Custom Selectors
// ============================================================================

(function($) {

  // Test if an element is in the DOM.
  $.expr[":"].attached = function(elem) {
    return $.contains(document.documentElement, elem);
  };

  $("div").is(":attached"); // true
  $("div").detach().is(":attached"); // false
  $("<div/>").is(":attached"); // false


  // How about a detached selector?
  $.expr[":"].detached = function(elem) {
    return !$.contains(document.documentElement, elem);
  };


  // Ok, now let's DRY this up a bit.
  $.extend($.expr[':'], {
    attached: attached,
    detached: function(elem) { return !attached(elem); }
  });

  function attached(elem) {
    return $.contains(document.documentElement, elem);
  }


  // You can also pass arguments to selectors.
  $.expr[":"].hasdata = function(elem, i, match) {
    var prop;
    // Element data.
    var data = $(elem).data();
    if (match[3] == null) {
      // Return true if data object has any properties.
      for (prop in data) { return true; }
      // Otherwise false.
      return false;
    } else {
      // Return true if argument is a property of the data object.
      return match[3] in data;
    }
  };

  $("p:hasdata").length; // 0
  $("p:first").data("foo", 123);
  $("p:hasdata").length; // 1
  $("p:hasdata(foo)").length; // 1
  $("p:hasdata(bar)").length; // 1

}(jQuery));

// ============================================================================
// Namespaces
// ============================================================================

(function($) {

  // For "static" jQuery methods, this will work.

  $.myPlugin = function() {
    // Your code goes here.
  };

  $.myPlugin.submethod = function() {
    // Your code goes here.
  };

  $.myPlugin();           // This will work.
  $.myPlugin.submethod(); // So will this.


  // For jQuery collection methods, this WILL NOT work.

  $.fn.myPlugin = function() {
    // Your code goes here.
  };

  $.fn.myPlugin.submethod = function() {
    // Your code goes here.
  };

  $("li").myPlugin();           // While this works great...
  $("li").myPlugin.submethod(); // This fails.

  // Why does the latter fail? Think about it. What's `this` inside submethod?


  // You can write a lot of code (believe me, I've tried) to make this kind of
  // thing work, but while it's technically possible, it's confusing. Just try
  // to keep track of chaining and .end(). Good times.
  $("li").myPlugin().submethod();


  // You can, of course, just use the jQuery UI Widget Factory to make a
  // stateful plugin with submethods, events and more.
  $("li").myPlugin("submethod", options);


  // For standard jQuery collection methods, this is usually sufficient.
  $.fn.myPlugin = function() {
    // Your code goes here.
  };

  $.fn.myPluginSubmethod = function() {
    // Your code goes here.
  };

  $("li").myPluginSubmethod();

}(jQuery));

// ============================================================================
// What Shouldn't be a jQuery Plugin
// ============================================================================

// Why shouldn't this be a jQuery plugin? Because this code has nothing to do
// with jQuery. It's just JavaScript. Don't attach arbitrary methods to jQuery
// unless they're REALLY jQuery plugins.
(function($) {
  var date;

  $.timer = {
    start: function() {
      date = new Date;
    },
    elapsed: function() {
      return new Date - date;
    }
  };
}(jQuery));

$.timer.start();
$.timer.elapsed(); // 1000 (or whatever number of milliseconds have elapsed)


// Use the CommonJS spec to create timer.js, and you've got a global timer
// objet with two functions.
(function(exports) {
  var date;

  exports.timer = {
    start: function() {
      date = new Date;
    },
    elapsed: function() {
      return new Date - date;
    }
  };
}(this.exports || this));

timer.start();
timer.elapsed(); // 1000 (or whatever number of milliseconds have elapsed)


// Of course, if you just do this before including the timer.js module...
this.exports = Bocoup.utils;
// ...include timer.js jere...
Bocoup.utils.timer.start();
Bocoup.utils.timer.elapsed(); // 1000 (etc)
// ...nd no new globals are introduced.
window.timer // undefined


// ============================================================================
// Extending Default Options
// ============================================================================

(function($) {

  var attrs = {};

  $.fn.

}(jQuery));

// ============================================================================
// Stateful Plugins with jQuery UI
// ============================================================================

// ============================================================================
// jQuery plugins index package.json
// ============================================================================


