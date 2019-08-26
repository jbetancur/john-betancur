---
title: Optimizing React Rendering
description: Why does my component re-render when using  React.memo or React.PureComponent?
date: "2019-08-18"
image: tuneup.jpg
published: true
---

Why does my component re-render when using [React.memo](https://reactjs.org/docs/react-api.html#reactmemo) or [React.PureComponent](https://reactjs.org/docs/react-api.html#reactpurecomponent)?

## TL;DR
Let's start with the answer. Make sure any object based props you are passing to your component are not being recreated on every re-render cycle, otherwise, the point of these optimizations are defeated. Of course, you're probably here because you want to dig a little deeper...

## Houston, We Have a Problem
Such an issue arose while I was developing [React Data Table](https://github.com/jbetancur/react-data-table-component). React Data Table has a deep component tree that consists of columns, rows, cells and in some places expensive calculations such as sorting, managing multiple checkbox state, column generation, etc.). Despite the use of `React.memo` on certain expensive components, the entire React Data Table library would re-render unnecessarily causing it to be noticeably slower when there were more than say twenty or thirty rows. The simple math is that a ten column table with thirty rows is three hundred something components (cells) all re-rendering.

## Equality & Sameness
Before we delve into the solution, let's briefly revisit how Javascript determines equality, starting with primitives. Primitives are strings, numbers, booleans, undefined and null (yep, undefined and null are types). These are considered value based comparisons. Comparing a primitive value to another equal primitive value will result in a true condition:

```js
'hello' === 'hello' // true
42 === 42 // true
true === true // true
undefined === undefined // true
null === null // true
```

Object equality, however, is determined by reference. A reference is pointer to the location of the object in memory, not its value or contents:

*Note that in Javascript arrays and functions are objects too!*

```js
{} === {} // false
[] === [] // false
(() => {}) === (() => {}) // false
```

The result is false because we're comparing two objects that have **different references**. Let's compare the **same object reference**:

```js
const obj = {}
obj === obj // true

const arr = []
arr === arr // true

const func = () => {}
func === func // true
```

Comparing the same reference is true because `obj` refers to the same address in memory. You might be thinking what happens if I mutate `obj`?

```js
const obj = {}
obj.hello = 'world'

obj === obj // true
```

`obj` is still true because the reference (location in memory) did not change. If you really wanted to make sure `obj` is truly equal to some other object you would need to iterate through each property in both objects, but that is not the same os object reference equality.

One last thing regarding object equality. What if our object is derived from the result of a function?

```js
function hello() { return 'hello planet earth' }
hello() === hello() // true - the return "value" is a string

function hello() { return { planet: 'earth' } }
hello() === hello() // false - the object reference is different
```

*Checkout [Equality comparisons and sameness](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness) if you want a deeper dive into Javascript equality.*

### Really, Really, Checking React props for Equality
This concept took me way too long to grasp (I'm a slow learner), but think of React components as functions (i.e. `function Component(props) {...}`) that are called when the component first mounts (the function is first called), then subsequently every time a state change originates from a parent or within the component itself. But what if we wanted to skip subsequent function invocations (i.e. re-renders)? Why should the function run again if its props haven't changed? Shouldn't the result be the same anyway?

Let's build on this idea with some examples. Pretend that `ExpensiveChild` is some crazy expensive component that slows down our UI. Luckily, React provides us with `React.memo` and `React.PureComponent`. Both give us an escape hatch to the rendering process and are a good starting point by allowing React to perform a [shallow prop check](https://github.com/facebook/react/blob/v16.9.0/packages/shared/shallowEqual.js) on any props that are passed to a component before the component re-renders.

In the example below, you'll notice that `ExpensiveChild` will re-render every time you click either of the buttons. You may already know that this is because `setCount` (`this.setState` in a class component) is a request for React to re-render `Parent` with the updated `count`. By design, when `Parent` re-renders React will also re-render all of its children all the way down the component hierarchy.

<iframe src="https://codesandbox.io/embed/re-render-child-as-props-9rmg5?expanddevtools=1&fontsize=14" title="Re-render Forever" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

Let's apply `React.memo` and `React.PureComponent` to `ExpensiveChild` and see what happens:

### Using React.PureComponent
By extending our class Component with `React.PureComponent` React will only render `ExpensiveChild` on the initial mount. Thereafter, re-renders are skipped unless the string prop `text` changes:

<iframe src="https://codesandbox.io/embed/purecomponent-66xl6?expanddevtools=1&fontsize=14" title="PureComponent" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

### Using React.memo
We can achieve the same result as above for a functional component by wrapping it with `React.memo`:

<iframe src="https://codesandbox.io/embed/re-render-forever-hvsf6?expanddevtools=1&fontsize=14" title="Memo" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

Wow, that was easy! No more re-renders!

Let's make this more interesting by also passing the `data` object. For brevity and cool points, we are going to stick with the Hooks example:

<iframe src="https://codesandbox.io/embed/re-render-forever-h28q0?expanddevtools=1&fontsize=14" title="Re-render Memo Forever" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

Damn, damn, damn. Now we're re-rendering again! Shouldn't `React.memo` have taken care of this for us? What do you think is wrong here?

You guessed it! The `data` object is being re-created every time `Parent` re-renders. Which means the `React.memo` shallow prop checking in `ExpensiveChild` is skipped. What a waste!

One glaringly obvious solution is to just move `data` outside of `Parent` so it's only created once, however, what if your `data` object needs access to the `Parent` scope?

There must be a way to cache a reference to `data` while keeping it's scope within our component, then, pass that to `ExpensiveChild` instead of re-creating `data` on every re-render...

## Memoization
[Memoization](https://en.wikipedia.org/wiki/Memoization) is a fancy computer science term for caching the result of a value or function and keeping it's object reference rather than creating a new one.

Let's memoize the `data` prop before it's passed to `ExpensiveChild`. In our functional component example we can use `React.useMemo` (`React.useCallback` is useful when we want to memoize a function):

<iframe src="https://codesandbox.io/embed/re-render-memo-forever-ev7jh?expanddevtools=1&fontsize=14" title="Re-render Memo Fixed" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

Problem solved! Our `ExpensiveChild` component not longer re-renders unless `data` changes. By the way, you may have noticed that `React.memo` reads a lot like `React.memoize`. That's because `React.memo` and even `React.PureComponent` are also memoization.
