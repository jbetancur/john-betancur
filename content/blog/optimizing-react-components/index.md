---
title: Optimizing React Components
date: "2019-08-18T22:40:32.169Z"
description: While pre-optimization can be the root of all evil there are some best practices you can adhere to that will ensure your React components are performing at their best.
---

While pre-optimization can be the root of all evil there are some best practices you can adhere to that will ensure your React components are performing at their best.

This weeks topic will is around using  `React.memo` or `React.PureComponent` for cases where you need to limit re-renders on your components, specifically as it relates to passing props. I was pretty tripped up on this while developing [React Data Table](https://github.com/jbetancur/react-data-table-component) which uses has a very deep component tree, rows and cells.

## Equality & Sameness
Before we delve further, it's important to first understand how Javascript compares non primitives. Primitives such as strings, numbers and booleans are value based comparisons.

```js
'hello' === 'hello' // true
42 === 42 // true
true === true // true
```

When it comes to Objects, Arrays and Functions things are quite the opposite:

```js
{} === {} // false
[] === [] // false
(() => {}) === (() => {}) // false
```

Let's get even weirder and just compare the same object we created to itself (in Javascript Arrays and Functions are objects too!):

```js
const obj = {};
obj === obj // true

const arr = [];
arr === arr // true

const func = () => {}
func === func // true
```

So, why does `{} === {} = false` but `obj === obj` = true?

`{}` is a different **instance** of `{}`, but `obj` is the same **instance** of `obj` and therefore the former will always be false even if the objects contents are the same. By **instance** we mean that it is an entirely new object and instead of checking for value based like our primitives Javascript is checking if the instances are the same.

Hold onto this tidbit of knowledge as it's going to take us far into making sure our `memo` and `PureComponent` are doing their job.

Checkout [Equality comparisons and sameness](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness) if you want a deeper dive.

## Re-Rendering based on prop changes
This concept took me way too long to grasp, but components at their most basic level are nothing more than functions that are called when the component first mounts and subsequently when the state changes from a parent or within the component itself.

Let's start with a simple example. In the console you'll notice that `ExpensiveChild` will re-render every time you click a button (i.e. the state is updated in `Parent`). This is because `setCount` is a request to re-render with the new `count`:

<iframe src="https://codesandbox.io/embed/re-render-child-as-props-9rmg5?expanddevtools=1&fontsize=14" title="Re-render Forever" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

However, as the name of our child component implies we want to limit `ExpensiveChild` to only re-render when it needs to. React gives you some escape hatches you can use to limit renders. [React.PureComponent](https://reactjs.org/docs/react-api.html#reactpurecomponent) for class components and [React.memo](https://reactjs.org/docs/react-api.html#reactmemo) for functional components.

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

Yep, you guessed it. The `data` object is being re-created every time `Parent` re-renders. Which means the shallow checking in `ExpensiveChild` `memo` is totally skipped. What a waste!

## Solutions
We can fix this several ways depending on our use case.

### Memoization
Memoize the `data` object before we pass it to `ExpensiveChild` if your data is dynamic or requires access to variables and functions within the component. Here we can use the React hook `React.useMemo` (`React.useCallback` is useful for functions):

<iframe src="https://codesandbox.io/embed/re-render-memo-forever-ev7jh?expanddevtools=1&fontsize=14" title="Re-render Memo Fixed" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

### Outer scope
By moving `data` out of the component (in the case of class components out of the render method) so that it is only created once. This is likely to be the solution if your data is static:

<iframe src="https://codesandbox.io/embed/re-render-memo-fixed-nmxxc?expanddevtools=1&fontsize=14" title="Re-render Static Data" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

### Pass Component as prop
We can also explore another way to do this by passing our component in as a prop to `Parent` without even using `React.memo` or `React.PureComponent`!

<iframe src="https://codesandbox.io/embed/re-render-memo-fixed-v5w4n?expanddevtools=1&fontsize=14" title="Re-render as Prop" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>