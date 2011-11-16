module("jQuery#enumerate");

test("chainable", 1, function() {
  var items = $("#qunit-fixture li");
  strictEqual(items.enumerate(), items, "should be chaninable");
});

test("no args passed", 3, function() {
  var items = $("#qunit-fixture li").enumerate();
  equal(items.eq(0).text(), "1. foo", "first item should have index 1");
  equal(items.eq(1).text(), "2. bar", "second item should have index 2");
  equal(items.eq(2).text(), "3. baz", "third item should have index 3");
});

test("0 passed", 3, function() {
  var items = $("#qunit-fixture li").enumerate(0);
  equal(items.eq(0).text(), "0. foo", "first item should have index 0");
  equal(items.eq(1).text(), "1. bar", "second item should have index 1");
  equal(items.eq(2).text(), "2. baz", "third item should have index 2");
});

test("1 passed", 3, function() {
  var items = $("#qunit-fixture li").enumerate(1);
  equal(items.eq(0).text(), "1. foo", "first item should have index 1");
  equal(items.eq(1).text(), "2. bar", "second item should have index 2");
  equal(items.eq(2).text(), "3. baz", "third item should have index 3");
});
