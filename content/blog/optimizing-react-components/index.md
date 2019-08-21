---
title: Optimizing React Components
date: "2019-08-18T22:40:32.169Z"
description: While pre-optimization can sometimes be the root of all evil there are times when you need to use shallow prop comparisons such as React.memo and React.PureComponent. But what happens when you've done that and your component still re-renders?
image: tuneup.jpg
published: true
---

While pre-optimization can sometimes be the root of all evil there are times when you need to use shallow prop comparisons such as [React.memo](https://reactjs.org/docs/react-api.html#reactmemo) and [React.PureComponent](https://reactjs.org/docs/react-api.html#reactpurecomponent). But what happens when you've done that and your component still re-renders?

The first thing you'll want to check is that the props you are passing to your component are actually "the same". Such an issue arose while I was developing [React Data Table](https://github.com/jbetancur/react-data-table-component). React Data Table has a deep component tree that consists of headers, rows, cells and in some places expensive calculations such as sorting, column generation, themes, etc...). Despite the use of `React.memo` on expensive components, the entire React Data Table library would re-render its rows, columns, cells, checkboxes and perform a re-sort whenever it's parent component triggered a re-render.

As it turned out I thought that I was passing the same props down my component tree, but in fact they were not. This negated the benefit that `React.memo` was trying to provide.

## Equality & Sameness
Before we delve into the solution, it's important to briefly revisit how Javascript performs comparisons. Let's start with primitives. Primitives in Javascript are strings, numbers, booleans, undefined and null (yep, undefined and null are types). These are considered value based comparisons. This means that comparing primitive values to another equal primitive value will result in a true condition:

```js
'hello' === 'hello' // true
42 === 42 // true
true === true // true
```

Objects are different, however. Instead of value comparison Javascript uses object reference instead:

*Note that in Javascript arrays and functions are objects too!*

```js
{} === {} // false
[] === [] // false
(() => {}) === (() => {}) // false
```

Why are these false in the example above? Because we're comparing two objects that have **different references**. Let's instead compare the **same object reference** and see what the result is:

```js
const obj = {};
obj === obj // true

const arr = [];
arr === arr // true

const func = () => {}
func === func // true
```

So... why does `{} === {} = false` but `obj === obj = true`?  Because `{}` is a different **reference** of `{}`, but the `obj` variable that was assigned is the same **reference** to itself. So, comparing the same reference results in true, while comparing different references will result in false. If you are thinking about deep object comparison that's for another post, but the goal here is for you to understand that `{}` is not equal to `{}`.

Hold onto this tidbit of knowledge as it's going to take us far into making sure our `React.memo` and `React.PureComponent` are actually solving our re-rendering issue.

*Checkout [Equality comparisons and sameness](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness) if you want a deeper dive.*

## Are My Component Props Really The Same?
This concept took me way too long to grasp, but components at their most basic level are nothing more than functions with props as parameters that are called when the component first mounts and subsequently when the state changes from a parent or within the component itself. `React.PureComponent` and `React.memo` simply just add an extra step to the rendering process to check if our props did not change and thus return true or false that the component should re-render.

Let's pretend that for whatever reason that `ExpensiveChild` is some crazy expensive component. In the example below you'll notice that `ExpensiveChild` will re-render every time you click a button (i.e. the state is updated in `Parent`). You may already know that this is because `setCount` is a request to re-render with the updated `count`:

<iframe src="https://codesandbox.io/embed/re-render-child-as-props-9rmg5?expanddevtools=1&fontsize=14" title="Re-render Forever" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

However, we want to limit `ExpensiveChild` to only re-render when it needs to. Let's go ahead and configure our component to only re-render when its props change.

### Using React.PureComponent
By making our class Component a `React.PureComponent` we can have React do some shallow checks for each prop to ensure each prop that is passed is equal. If so, re-rendering is skipped:

<iframe src="https://codesandbox.io/embed/purecomponent-66xl6?expanddevtools=1&fontsize=14" title="PureComponent" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

### Using React.memo
We can do the same thing for a functional component using `React.memo`:

<iframe src="https://codesandbox.io/embed/re-render-forever-hvsf6?expanddevtools=1&fontsize=14" title="Memo" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

In both examples above you can see that `ExpensiveChild` only renders once on mount, but subsequently is not re-rendered. Under the covers React is performing comparisons on each prop.

Ok, let's throw a wrench into the cogs and also pass an object. For brevity, we are going to stick with the Hooks example:

<iframe src="https://codesandbox.io/embed/re-render-forever-h28q0?expanddevtools=1&fontsize=14" title="Re-render Memo Forever" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

Damn, damn, damn. Now we're re-rendering again! Back to our comparison and sameness section above. What do you think is wrong here?

Yep, you guessed it. The `data` object is being re-created every time `Parent` re-renders. Which means the shallow checking in `ExpensiveChild` `React.memo` is totally skipped because `data `is a different object reference. What a waste!

## Viable Solutions
We can fix this several ways depending on our use case.

### Memoization
Memoize the `data` object before we pass it to `ExpensiveChild` if your data is dynamic or requires access to variables and functions within the component. [Memoization](https://en.wikipedia.org/wiki/Memoization) is a fancy computer science term for caching the result of a value or function and keeping it's object reference rather than creating a new one. Here we can use the React hook `React.useMemo` (`React.useCallback` is useful for memoizing functions):

<iframe src="https://codesandbox.io/embed/re-render-memo-forever-ev7jh?expanddevtools=1&fontsize=14" title="Re-render Memo Fixed" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

Again, it's up to you to determine whether memoization is actually benefiting performance, but in our example let's assume that it is.

### Outer Scope
Another way to optimize `data` is by moving the variable declaration outside of the component (in the case of class components out of the render method) so that it is only created once. This is likely to be the solution if `data` is a simple variable definition.

<iframe src="https://codesandbox.io/embed/re-render-memo-fixed-nmxxc?expanddevtools=1&fontsize=14" title="Re-render Static Data" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

But what if your `data` is actually derived from a function that returns your data object? In this outer scope scenario you will still need to memoize it using your own memoize function to a 3rd party library like [memoize-one](https://github.com/alexreardon/memoize-one) because every function invocation will return a new object.

## Recap
Now that you've determined that your component requires a conditional re-render we should have a solid understanding that when the props we pass are objects, arrays or functions that we must take care not to recreate them every time a render occurs. This will ensure that our `React.memo` and `React.PureComponent` are doing what they were intended to do.
