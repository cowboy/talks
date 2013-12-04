// ===========================================================================
// About Me.
// ===========================================================================

var cowboy = {
  name:      "Ben Alman",
  url:       "http://benalman.com/",
  twitter:   "@cowboy",
  github:    "cowboy",

  work: {
    name:    ["     __                                           ",
              "    |  |--..-----..-----..-----..--.--..-----.    ",
              "    |  _  ||  _  ||  ___||  _  ||  |  ||  _  |    ",
              "    |_____||_____||_____||_____||_____||   __|    ",
              "                                       |__|       "].join("\n"),
    title:   "Director of Pluginization",
    url:     "http://bocoup.com/",
    twitter: "@bocoup"
  },

  plugins:   ["BBQ", "doTimeout", "equalizeBottoms", "getObject", "Star Wipe",
              "hashchange event", "Tiny Pub/Sub", "throttle / debounce", "iff",
              "longUrl", "cond", "Message Queuing", "Random", "outside events",
              "postMessage", "replaceText", "resize event", "Untils", "unwrap",
              "URL Utils", "urlInternal", "loadAdScript", "Floating Scrollbar",
              "deparam", "infiniteScroller", "scrollinout event", "Sphere 3D",
              "Farthest Decendant", "Data+", "Detach+", "oneOnly", "queueFn",
              "Widget Bootstrap", ":scrollable selector", "liveOne", "each2",
              "bindAndTrigger", "isjQuery", ":attached, :detached selectors",
              "queueFn", "htmlDoc", "nodetype filter", "seq", "getUniqueClass",
              "getClassData", "sortObject", "selectColorize", "viewportOffset",
              "serializeObject", ":nth-last-child selector"],

  articles:  ["The \"catch\" with try-catch",
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
cowboy.plugins.length // 50

// Feel free to "tag along": http://bit.ly/jq-plugin-authoring-talk






// ===========================================================================
// What's a jQuery Plugin?
// ===========================================================================

// Note to self: talk about this for 30 seconds. Try not to ramble.

// This is not a jQuery plugin. Sure, it uses jQuery.. but it doesn't feel
// jQuery-like.
function setHref(elems, href) {
  elems.prop("href", href);
}

setHref($("a"), "/super-lame"); // AWKWARD


// Now this, on the other hand...
jQuery.fn.href = function(href) {
  if (arguments.length === 0) {
    return this.prop("href");
  } else {
    return this.prop("href", href);
  }
};

$("a").href("/super-awesome"); // AWESOME


// Which is doubly awesome, because it saves us, like, eight characters:
$("a").prop("href", "/super-awesome"); // SLIGHTLY LESS AWESOME






// ===========================================================================
// IIFE = Immediately Invoked Function Expression
// ===========================================================================

// Function Declaration.
function foo(a) { console.log("foo " + a); }
foo(1); // logs "foo 1"

// Function Expression.
var bar = function(a) { console.log("bar " + a); };
bar(2); // logs "bar 2"


// Without the parens, the IIFE is broken.
function(a) { console.log("broken " + a); }(3); // SyntaxError

// But with the parens, the IIFE works.
(function(a) { console.log("awesome " + a); }(4)); // logs "awesome 4"


// The "jQuery plugin" IIFE
(function($) {
  // Vars and functions are local to the IIFE.
  var myLocalVar = "plugin";
  function myLocalFunction() {
    return "my " + myLocalVar;
  }

  // A "static" jQuery method.
  $.myPlugin = function(isWhat) {
    return myLocalFunction() + " is " + isWhat;
  };

  // A "jQuery object" method.
  $.fn.myPlugin = function(isWhat) {
    return this.html( $.myPlugin(isWhat) );
  };
}(jQuery));

// These variables are private, and don't clutter up the global scope:
myLocalVar      // ReferenceError
myLocalFunction // ReferenceError

// But the jQuery plugin methods works just fine:
$.myPlugin("awesome") // "my plugin is awesome"



// What are the alternatives to using an IIFE?

// You could just use `jQuery` everywhere, instead of `$`.
jQuery.fn.myplugin = function(val) {
  if (jQuery.isFunction(val)) {
    // Do something.
  } else if (jQuery.isArray(val)) {
    // Do something else.
  }
};

// Why not just use `$`? Because if the plugin user had to use $.noConflict()
// to get jQuery to work with MooTools, congratulations. You've just created
// a MooTools plugin.
$.fn.myplugin = function() {
  // MooTools probably doesn't have $.fn anyways.
};

// Also, if you're not inside an IIFE, all your vars are global.
var myLocalVar = "This is really a global var";

// I've written a whole article about IIFEs. Read it.
// http://bit.ly/js-iife






// ===========================================================================
// What's `this` Inside a "jQuery Object" Method?
// ===========================================================================

(function($) {

  // Inside a "jQuery object" method:
  $.fn.test = function() {
    // this === the jQuery object.
  };

  $("div").test(); // Inside the "test" function, this === $("div")

  // Not to be confused with:

  // Inside an each callback (or map, or filter, or event handler, etc):
  $("div").each(function() {
    // this === the DOM element, as jQuery iterates over selected elements.
  });

}(jQuery));






// ===========================================================================
// Chainable Methods
// ===========================================================================

(function($) {

  // This kinda works...
  $.fn.href = function(href) {
    this.prop("href", href);
  };

  $("a").href("/test"); // This works.
  $("a").href("/test").addClass("not-gonna-work"); // TypeError, whoops!

  // Why? Because, in JavaScript, functions return `undefined` unless you
  // explicitly return a value.


  // Also, while we're talking about using jQuery methods in your plugin,
  // NEVER EVER EVER use undocumented (private) jQuery methods or properties
  // in your plugin. Why? Because that stuff has a long history of always
  // getting changed when you're least able to update your code, which makes
  // your plugin users all kinds of :'-( THIS EMOTICON IS CRYING

}(jQuery));


// So, how do we chain?

(function($) {

  // A little better...
  $.fn.href = function(href) {
    this.prop("href", href);
    return this; // returning `this` makes any method chainable!
  };

  $("a").href("/test"); // This still works.
  $("a").href("/test").addClass("gonna-work"); // Much better!

  // Here's the crazy part. Because the jQuery#prop method is chainable when
  // used as a setter, you can do this.
  $.fn.href = function(href) {
    return this.prop("href", href); // MIND = BLOWN
  };

}(jQuery));






// ===========================================================================
// Implicit (and Explicit) Iteration
// ===========================================================================

(function($) {

  // We all know this, right?
  $("li").html("hello world"); // Set the HTML of every selected element.
  $("li").html() // "hello world" (get the HTML of first selected element).

  // But what's the problem with this? (besides the fact that I haven't saved
  // a reference to the jQuery object in a variable, which we all know is bad)
  $("li").html( $("li").html() + "!!!" );


  // We can solve this problem in a few ways:

  // This is the preferred way (since jQuery 1.4).
  $("li").html(function(index, currentHtml) {
    return currentHtml + "!!!";
  });

  // This is the explicit way, using jQuery#each.
  $("li").each(function() {
    var elem = $(this);
    elem.html(elem.html() + "!!!");
  });


  // jQuery plugins need to explicitly iterate, so users don't have to!

  // This plugin works with 0 or 1 elements, but...
  $.fn.yell = function() {
    return this.html(this.html() + "!!!");
  };

  $("li").yell(); // ...2 or more P elements? Whoops.


  // This is much better. It works with 0, 1, or any number of elements.
  // Of course, I should probably have just used the "preferred" way, but I
  // wanted to make my point. Iterate with jQuery#each in your plugin.
  $.fn.yell = function() {
    return this.each(function() {
      var elem = $(this);
      elem.html(elem.html() + "!!!");
    });
  };

  $("li").yell(); // Works just like you (and your plugin's users) expect.

}(jQuery));


// Here's a general-purpose template. Modify as-necessary.

(function($) {

  $.fn.myPlugin = function() {
    return this.each(function() {
      // Your per-element code goes here!
    });
  };

}(jQuery));






// ===========================================================================
// Getters & Setters
// ===========================================================================

(function($) {

  // This works as a setter but NOT as a getter in newer versions of jQuery
  // because jQuery getter/setter methods look at the number of arguments
  // passed, not the values of the arguments.
  $.fn.href = function(href) {
    return this.prop("href", href);
  };

  // This works as both getter and setter, because the correct number of
  // arguments are used for both setter and getter.
  $.fn.href = function(href) {
    if (arguments.length === 0) {
      return this.prop("href");
    } else {
      return this.prop("href", href);
    }
  };

  $("a").href("/test"); // Set property of every selected element (and chain).
  $("a").href()         // "/test" (get property of first selected element).


  // What if our core logic couldn't just use a built-in jQuery method?
  $.fn.href = function(href) {
    if (arguments.length === 0) {
      // No arguments were passed (getter). Return the current href property
      // of the first selected element if there is one, otherwise null.
      return this.length === 0 ? null : this.get(0).href;
    } else {
      // An argument was passed (setter). Set the current href property of all
      // selected elements and return the jQuery object, allowing chaining.
      return this.each(function() {
        this.href = href;
      });
    }
  };

}(jQuery));






// ===========================================================================
// Creating .end()-able Traversal & Filtering Methods
// ===========================================================================

(function($) {

  // Have you ever used the jQuery#end method?
  $("ul").children().addClass("li").end().addClass("ul");


  // So, how do you create your own .end()-able method?

  // If you're using a jQuery method internally, it's easy.
  $.fn.spans = function() {
    return this.find("span");
  };

  // Awesome!
  $("div").spans().addClass("span").end().addClass("div");


  // But what if things get a little more.. complicated? Note: Andrew Wirick
  // (aka @amwirick) came up with this plugin scenario. Thanks, Andrew!
  $.fn.cousins = function() {
    return this.parent().siblings().children();
  };

  // Whoops! jQuery#end only reverts to the previous set.
  $("li:eq(0)").cousins().addClass("cousin").end().addClass("aunt-or-uncle");


  // Let's do this the right way, using jQuery.pushStack.
  $.fn.cousins = function() {
    return this.pushStack( this.parent().siblings().children() );
  };

  // Much better.
  $("li:eq(0)").cousins().addClass("cousin").end().addClass("li");


  // jQuery#pushStack supports a few more options. Check out the API docs
  // and jQuery source for more info.
  // http://api.jquery.com/pushStack/
  // http://bit.ly/jqsource

}(jQuery));






// ===========================================================================
// A Few Other .end()-able Method Patterns.
// ===========================================================================

(function($) {

  // Filter the current set of nodes down to just text nodes.
  $.fn.textNodes = function() {
    return this.filter(function() {
      return this.nodeType === Node.TEXT_NODE;
    });
  };

  $("li").contents().textNodes(); // Works!


  // Traverse from the current set of elements.
  $.fn.firstChildren = function() {
    return this.map(function() {
      // Add some DOM element or array of DOM elements to the result set.
      return this.firstChild;
    });
  };

  $("ul").firstChildren(); // Note: Might return textNodes.


  // For this method, jQuery#pushStack would have been a better choice.
  $.fn.cousins = function() {
    return this.map(function() {
      return $(this).parent().siblings().children().get();
    });
  };

})(jQuery);






// ===========================================================================
// Namespacing Your Plugin
// ===========================================================================

(function($) {

  // For "static" jQuery methods, this works wonderfully:

  $.myPlugin = function() {
    // Your code goes here.
  };

  $.myPlugin.submethod = function() {
    // Your code goes here.
  };

  $.myPlugin(); // This will work.
  $.myPlugin.submethod(); // So will this.


  // For "jQuery object" methods, this DOES NOT WORK WONDERFULLY:

  $.fn.myPlugin = function() {
    // Your code goes here.
  };

  $.fn.myPlugin.submethod = function() {
    // Your code goes here.
  };

  $("li").myPlugin(); // Works great.
  $("li").myPlugin.submethod(); // Not so great.

  // Why does it fail? Think about it. What's `this` inside submethod?


  // You can write a lot of code (believe me, I've tried) to make this kind of
  // thing work, but while it's technically possible, it's confusing. Just try
  // to keep track of chaining and .end(). Good times.
  $("li").myPlugin().submethod();


  // For basic "jQuery object" methods, this is usually sufficient.
  $.fn.myPlugin = function() {
    // Your code goes here.
  };

  $.fn.myPluginSubmethod = function() {
    // Your code goes here.
  };

  $("li").myPlugin(); // Works great.
  $("li").myPluginSubmethod(); // Also works great.


  // You can, of course, just use the jQuery UI Widget Factory to make a
  // stateful plugin with submethods, events and more. Read more here:
  // http://ajpiano.com/widgetfactory/
  // http://blog.nemikor.com/2010/05/15/building-stateful-jquery-plugins/
  $("li").myPlugin("submethod", options);

}(jQuery));






// ===========================================================================
// Custom Selectors
// ===========================================================================

(function($) {

  // Test if an element is in the DOM.
  $.expr.filters.attached = function(elem) {
    return $.contains(document.documentElement, elem);
  };

  $("div").is(":attached")          // true
  $("div").detach().is(":attached") // false
  $("<div/>").is(":attached")       // false


  // How about a detached selector?
  $.expr.filters.detached = function(elem) {
    return !$.contains(document.documentElement, elem);
  };

  $("div").is(":detached")          // false
  $("div").detach().is(":detached") // true
  $("<div/>").is(":detached")       // true


  // Now let's organize this code and DRY it up a bit.
  $.extend($.expr.filters, {
    attached: function(elem) {
      return $.contains(document.documentElement, elem);
    },
    detached: function(elem) {
      return !$.expr.filters.attached(elem);
    }
  });


  // You can also pass arguments to selectors, match[3] is that value.
  $.expr.filters.hasdata = function(elem, i, match) {
    // Has data been stored on the element?
    var hasData = $.hasData(elem);
    if (match[3] == null) {
      // If no argument was passed to :hasdata, just return true or false
      // based on whether or not data has been stored on the element.
      return hasData;
    } else {
      // If an argument was passed to :hasdata(), return true if argument is
      // a property of the data object.
      return hasData && match[3] in $(elem).data();
    }
  };

  $("p:hasdata").length           // 0
  $("p:first").data("foo", 123);
  $("p:hasdata").length           // 1
  $("p:hasdata(foo)").length      // 1
  $("p:hasdata(bar)").length      // 0


  // Note: you might also see $.expr[":"] used in custom selectors. It's
  // just another reference to the $.expr.filters object. See the jQuery
  // source if you don't believe me! http://bit.ly/jqsource

  // And FWIW, testing `val == null` yields the same result as testing
  // `val === null || val === undefined`. In general, you should avoid the
  // == operator, because it does type coercion. But it's super-convenient
  // for testing to see if a value is either null or undefined. So, in this
  // case, it's ok. There are articles about this. JSHint has an "eqnull"
  // setting just for this. But use === otherwise.

}(jQuery));






// ===========================================================================
// Extending Default Options
// ===========================================================================

(function($) {

  // If your plugin only has one option, handling defaults is easy.
  $.fn.colorize = function(color) {
    return this.css("color", color || "black");
  };

  $("p").colorize();        // black!
  $("p").colorize("green"); // green!


  // When you start to have more optional arguments, things can get messy:

  $.fn.colorizeAndOrSetWidth = function(color, width) {
    // If `width` was passed, but `color` was not, shuffle argument values.
    if (typeof color === "number") {
      width = color;
      color = null;
    }
    // Set arguments to default values if necessary.
    if (color == null) { color = "red"; }
    if (width == null) { width = 100; }
    // Now we can finally, actually, do stuff.
    return this.css("color", color).width(width);
  };


  // And what about accepting a string width value like "1em"? How do you
  // know if a string or a width was passed? You don't.


  // Let's use default options:

  var defaults = {color: "red", width: 100};

  $.fn.colorizeAndOrSetWidth = function(options) {
    // Copy defaults and then the passed options into an empty object, then
    // set the result into options, thus updating it.
    options = $.extend({}, defaults, options);
    // Now do stuff.
    return this.css("color", options.color).width(options.width);
  };


  // You can also expose the defaults so they can be changed by the user:

  $.fn.colorizeAndOrSetWidth = function(options) {
    // Copy defaults and then the passed options into an empty object, then
    // set the result into options, thus updating it.
    options = $.extend({}, $.fn.colorizeAndOrSetWidth.options, options);
    // Now do stuff.
    return this.css("color", options.color).width(options.width);
  };

  // Expose default options.
  $.fn.colorizeAndOrSetWidth.options = {color: "red", width: 100};

}(jQuery));






// ===========================================================================
// What Shouldn't be a jQuery Plugin
// ===========================================================================

// Why shouldn't this be a jQuery plugin? Because this code has nothing to do
// with jQuery. It's just JavaScript. Don't attach arbitrary methods to jQuery
// unless they're REALLY jQuery plugins.
(function($) {
  var startDate;

  $.timer = {
    start: function() {
      startDate = new Date();
    },
    elapsed: function() {
      return new Date() - startDate;
    }
  };
}(jQuery));

$.timer.start();
// wait one second
$.timer.elapsed(); // 1000


// Use this structure when creating timer.js, and you'll get a global timer
// object with two functions.
(function(exports) {
  var startDate;

  exports.timer = {
    start: function() {
      startDate = new Date();
    },
    elapsed: function() {
      return new Date() - startDate;
    }
  };
}(typeof exports === "object" && exports || this));

timer.start();
// wait one second
timer.elapsed(); // 1000


// Don't like globals? Me neither. Just do something like this before
// including the timer.js module:

this.exports = Bocoup.utils;
// << Include timer.js here! >>
Bocoup.utils.timer.start();
Bocoup.utils.timer.elapsed(); // 1000 (etc)

// And no new globals have been introduced.
window.timer // undefined


// Or just use a script loader! This non-jQuery-specific timer.js will work
// in Node.js, RequireJS and curl.js (there's a config option for it).

// Per John Hann (aka @unscriptable), "As long as the AMD loader can auto-wrap
// CommonJS modules in a define(), it's all good."





// ===========================================================================
// Using grunt
// ===========================================================================

// The website (coming soon)
// http://gruntjs.com/

// A jQuery Plugin with Grunt & QUnit
// http://javascriptplayground.com/blog/2012/04/a-jquery-plugin-with-grunt-qunit

// Grunt: Let's create a jQuery plugin!
// http://codestre.am/c87f9daa6ec5df92dbc6edfc8





// ===========================================================================
// jQuery Plugins Index package.json
// ===========================================================================

// Still under development, actually. Check this out for the latest info:
// https://github.com/jquery/plugins.jquery.com/blob/master/docs/package.md
