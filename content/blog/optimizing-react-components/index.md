---
title: Optimizing React Components
date: "2019-08-18T22:40:32.169Z"
description: While pre-optimization can be the root of all evil there those times when you need to use shallow prop comparisons such as React.memo and React.PureComponent. But what happens when you've done that and your component still re-renders?
---

While pre-optimization can be the root of all evil there those times when you need to use shallow prop comparisons such as [React.memo](https://reactjs.org/docs/react-api.html#reactmemo) and [React.PureComponent](https://reactjs.org/docs/react-api.html#reactpurecomponent). But what happens when you've done that and your component still re-renders?

First things first - check that your props are actually "the same". Such an issue arose while I was developing [React Data Table](https://github.com/jbetancur/react-data-table-component). React Data Table has a deep component tree that consists of headers, rows, cells and in some places expensive calculations such as sorting, column generation, themes, etc...). Even with `React.memo` the entire React Data Table library would re-render its rows, columns, cells, checkboxes, re-sort etc when it's parent component triggered a re-render.

## BTW, You probably don't need React.memo or React.PureComponent
It's a common misconception that you need to wrap all your components in a `React.PureComponent` or `React.memo` to prevent those evil re-renders. Applying shallow checking in this blind manner may either have no performance impact or it may slow things down depending on how many props you are comparing. Additionally, React has something called reconciliation where it only renders what changed before committing a change to the DOM.

A good rule of thumb is components that contain little or no logic are better off re-rendering all the live long day whereas components with expensive calculations should typically only re-render when their props or state actually change.

## Equality & Sameness
Before we delve further, it's important to first understand how Javascript compares non primitives. Primitives in Javascript are strings, numbers and booleans and are considered value based comparisons.

```js
'hello' === 'hello' // true
42 === 42 // true
true === true // true
```

The above is true because the **values** are equal to each other. When it comes to objects things are quite the opposite. Note that in Javascript arrays and functions are objects too!

```js
{} === {} // false
[] === [] // false
(() => {}) === (() => {}) // false
```

Let's get even weirder and just compare the same object we created to itself:

```js
const obj = {};
obj === obj // true

const arr = [];
arr === arr // true

const func = () => {}
func === func // true
```

So, wait... why does `{} === {} = false` but `obj === obj = true`?

Unlike primitives that compare values objects on the other hand compare the instantiation of that object. For example, `{}` is a different **instance** of `{}`, but `obj` is the same **instance** of `obj` and therefore the former will always be false even if the object contents are the same.

Hold onto this tidbit of knowledge as it's going to take us far into making sure our `React.memo` and `React.PureComponent` are solving our re-rendering issue.

Checkout [Equality comparisons and sameness](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness) if you want a deeper dive.

## Did Props Really change?
This concept took me way too long to grasp, but components at their most basic level are nothing more than functions with props(args) that are called when the component first mounts and subsequently when the state changes from a parent or within the component itself.

Let's start with a simple example. Use your imagination and pretend that `ExpensiveChild` is some crazy expensive component. In the console you'll notice that `ExpensiveChild` will re-render every time you click a button (i.e. the state is updated in `Parent`). This is because `setCount` is a request to re-render with the new `count`:

<iframe src="https://codesandbox.io/embed/re-render-child-as-props-9rmg5?expanddevtools=1&fontsize=14" title="Re-render Forever" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

However, as the name of our child component implies we want to limit `ExpensiveChild` to only re-render when it needs to.

### React.PureComponent
By making our class Component a `React.PureComponent` we can have React do some shallow checks for each prop to ensure each prop that is passed is equal. If so, re-rendering is skipped:

<iframe src="https://codesandbox.io/embed/memo-66xl6?expanddevtools=1&fontsize=14" title="PureComponent" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

### React.memo
We can do the same thing for a functional component using `React.memo`:

<iframe src="https://codesandbox.io/embed/re-render-forever-hvsf6?expanddevtools=1&fontsize=14" title="Memo" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

In both above examples you can see that `ExpensiveChild` only rendered once on mount!

Ok let's throw a wrench into the cogs and also pass an object. We are going to stick with the Hooks examples for now:

<iframe src="https://codesandbox.io/embed/re-render-forever-h28q0?expanddevtools=1&fontsize=14" title="Re-render Memo Forever" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

Damn, damn, damn. Now we're re-rendering again! Back to our comparison and sameness section above. What do you think is wrong here?

Yep, you guessed it. The `data` object is being re-created every time `Parent` re-renders. Which means the shallow checking in `ExpensiveChild` `React.memo` is totally skipped. What a waste!

## Solutions
We can fix this several ways depending on our use case.

### Memoization
Memoize the `data` object before we pass it to `ExpensiveChild` if your data is dynamic or requires access to variables and functions within the component. Here we can use the React hook `React.useMemo` (`React.useCallback` is useful for functions):

<iframe src="https://codesandbox.io/embed/re-render-memo-forever-ev7jh?expanddevtools=1&fontsize=14" title="Re-render Memo Fixed" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

### Outer scope
By moving `data` out of the component (in the case of class components out of the render method) so that it is only created once. This is likely to be the solution if your data is static:

<iframe src="https://codesandbox.io/embed/re-render-memo-fixed-nmxxc?expanddevtools=1&fontsize=14" title="Re-render Static Data" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
