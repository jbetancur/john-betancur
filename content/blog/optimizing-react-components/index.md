---
title: Optimizing React Components
date: "2019-08-18T22:40:32.169Z"
description: While pre-optimization can sometimes be the root of all evil there are times when you need to use shallow prop comparisons such as React.memo and React.PureComponent. But what happens when you've done that and your component still re-renders?
image: tuneup.jpg
---

While pre-optimization can sometimes be the root of all evil there are times when you need to use shallow prop comparisons such as [React.memo](https://reactjs.org/docs/react-api.html#reactmemo) and [React.PureComponent](https://reactjs.org/docs/react-api.html#reactpurecomponent). But what happens when you've done that and your component still re-renders?

First things first - check that your props are actually "the same". Such an issue arose while I was developing [React Data Table](https://github.com/jbetancur/react-data-table-component). React Data Table has a deep component tree that consists of headers, rows, cells and in some places expensive calculations such as sorting, column generation, themes, etc...). Despite my use of `React.memo` on expensive components the entire React Data Table library would re-render its rows, columns, cells, checkboxes and perform a re-sort when it's parent component triggered a re-render.

## BTW, you may not need React.memo or React.PureComponent
It's a common misconception that you need to wrap all your components in a `React.PureComponent` or `React.memo` to prevent those evil re-renders. Applying shallow checking in this blind manner may either have no performance impact or it may slow things down depending on how many props you are comparing. Additionally, regarding what is changed in the DOM React performs something called reconciliation where it only compares what changed before committing a change.

A good rule of thumb is components that contain little or basic logic are better off re-rendering all the live long day whereas components with expensive calculations should typically only re-render when their props or state actually change. This is where `React.PureComponent` or `React.memo` are useful when used correctly.

## Equality & Sameness
Before we delve further, it's important to reiterate how Javascript compares non primitives. Primitives in Javascript are strings, numbers, booleans, undefined and null and are considered value based comparisons - meaning that we compare the **values**.

```js
'hello' === 'hello' // true
42 === 42 // true
true === true // true
```

When it comes to objects things are different. Instead of value comparison objects use object reference for comparison. Note that in Javascript arrays and functions are objects too!

```js
{} === {} // false
[] === [] // false
(() => {}) === (() => {}) // false
```

So above we're comparing two objects that have different references. Let's instead compare the same object reference and see that the result is:

```js
const obj = {};
obj === obj // true

const arr = [];
arr === arr // true

const func = () => {}
func === func // true
```

So, wait... why does `{} === {} = false` but `obj === obj = true`?

Another way to word it is that `{}` is a different **instance** or reference of `{}`, but `obj` is the same **instance** or reference of `obj` and therefore the former will always be false even if the object contents are the same. If you are thinking about deep object comparison that's for another post, but the goal here is for you to understand that `{} !== {}`.

Hold onto this tidbit of knowledge as it's going to take us far into making sure our `React.memo` and `React.PureComponent` are actually solving our re-rendering issue.

*Checkout [Equality comparisons and sameness](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness) if you want a deeper dive.*

## Did Props Really Change?
This concept took me way too long to grasp, but components at their most basic level are nothing more than functions with props as parameters that are called when the component first mounts and subsequently when the state changes from a parent or within the component itself.

Let's start with a simple example. Let's pretend that for whatever reason that `ExpensiveChild` is some crazy expensive component. In the example below you'll notice that `ExpensiveChild` will re-render every time you click a button (i.e. the state is updated in `Parent`). You may already know that this is because `setCount` is a request to re-render with the updated `count`:

<iframe src="https://codesandbox.io/embed/re-render-child-as-props-9rmg5?expanddevtools=1&fontsize=14" title="Re-render Forever" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

However, we want to limit `ExpensiveChild` to only re-render when it needs to.

### React.PureComponent
By making our class Component a `React.PureComponent` we can have React do some shallow checks for each prop to ensure each prop that is passed is equal. If so, re-rendering is skipped:

<iframe src="https://codesandbox.io/embed/purecomponent-66xl6?expanddevtools=1&fontsize=14" title="PureComponent" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

### React.memo
We can do the same thing for a functional component using `React.memo`:

<iframe src="https://codesandbox.io/embed/re-render-forever-hvsf6?expanddevtools=1&fontsize=14" title="Memo" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

In both above examples you can see that `ExpensiveChild` only renders once on mount, but subsequently is not re-rendered. Under the covers React is performing comparisons on each prop which in our case (imagine that our component has some really expensive calculation) is a cheaper operation than letting `ExpensiveComponent` re-render.

Ok let's throw a wrench into the cogs and also pass an object. For brevity, we are going to stick with the Hooks example:

<iframe src="https://codesandbox.io/embed/re-render-forever-h28q0?expanddevtools=1&fontsize=14" title="Re-render Memo Forever" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

Damn, damn, damn. Now we're re-rendering again! Back to our comparison and sameness section above. What do you think is wrong here?

Yep, you guessed it. The `data` object is being re-created every time `Parent` re-renders. Which means the shallow checking in `ExpensiveChild` `React.memo` is totally skipped. What a waste!

## Viable Solutions
We can fix this several ways depending on our use case.

### Memoization
Memoize the `data` object before we pass it to `ExpensiveChild` if your data is dynamic or requires access to variables and functions within the component. Memoization is a fancy computer science term for caching the result of a value or function and keeping it's object reference rather than creating a new one. Here we can use the React hook `React.useMemo` (`React.useCallback` is useful for memoizing functions):

<iframe src="https://codesandbox.io/embed/re-render-memo-forever-ev7jh?expanddevtools=1&fontsize=14" title="Re-render Memo Fixed" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>


Again, it's up to you to determine whether memoization is actually benefiting performance, but in our example let's assume that it is.

### Outer Scope
Another way to optimize `data` is by moving the variable declaration outside of the component (in the case of class components out of the render method) so that it is only created once. This is likely to be the solution if your data is static:

<iframe src="https://codesandbox.io/embed/re-render-memo-fixed-nmxxc?expanddevtools=1&fontsize=14" title="Re-render Static Data" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

Keep in mind that with the outer scope solution if you are referencing a function you will still need to memoize it using your own memoize function to a 3rd party library like `memoize-one`.

## Recap
Now that you've determined that your component requires a conditional re-render we should have a solid understanding that when the props we pass are objects, arrays or functions that we must take care not to recreate them every time a render occurs. This will ensure that our `React.memo` and `React.PureComponent` are doing what they were intended to do.
