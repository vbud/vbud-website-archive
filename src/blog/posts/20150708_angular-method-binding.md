---
title: Some weirdness with Angular directive method binding
description: Method binding on Angular directives takes an invoked function, not a reference to the function. 
tags:
- AngularJS
- JavaScript
- directive
- method binding
---

One strange thing I had to wrap my head around recently was the behavior of method binding in Angular directives. You use method binding when you want to pass a function from a parent scope to the directive's isolate scope.

## tldr; version

When using Angular method binding, you have to pass in an invoked function, like so:

```html
<panda do-something="vm.doSomething()"></panda>
```

The below **will not work**:

```html
<panda do-something="vm.doSomething"></panda>
```

Read on for the longer explanation...


## The whole story

To review, method binding looks like this in the Angular directive code:

```js
app.directive('panda', function() {
	return {
		scope: {
			doSomething: '&'
		},
		...
	};
});
```

So I thought that all I needed to do was just hand it a function like so:

```html
<panda do-something="vm.doSomething"></panda>
```

And that function is defined to do this in the parent controller:

```js
vm.doSomething = function() {
	console.log('hello');
};
```

Then back in the directive, I should just be able to call the function, right?

```js
app.directive('panda', function() {
	return {
		scope: {
			doSomething: '&'
		},
		link: function(scope) {
			scope.doSomething();
		}
	};
});
```

But unfortunately, that does not work. The `scope.doSomething()` call does nothing at all, and no error is logged.

After some complaining to teammates, I found the problem. You cannot just pass a function reference into the method binding. In other words, *this* does not work:
```html
<panda do-something="vm.doSomething"></panda>
```

But *this* **does work**!
```html
<panda do-something="vm.doSomething()"></panda>
```

For whatever reason, Angular expects an invoked function here.

So we solved the problem, but what happens if you want to pass arguments into the function? E.g. you want to do this:
```js
scope.doSomething('hello', 'goodbye');
```

My first guess was to have your parent function return another function. Then you can do something like this:
```js
scope.doSomething()('hello', 'goodbye');
```

Clunky, but it works.

Alternatively (and I believe this is the *correct* way), you can also pass arguments in with an object - check out Example 8 in [CMCDragonkai's AngularJS Directive Attribute Binding Explanation gist](https://gist.github.com/CMCDragonkai/6282750).

```js
<panda do-something="vm.doSomething({param1: 'hello', param2: 'goodbye'})"></panda>
```
