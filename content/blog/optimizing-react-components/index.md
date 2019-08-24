---
title: Optimizing React Components
description: If you're using React.memo or React.PureComponent to skip re-rendering on an expensive component, you'll want to make sure any object based props you are passing to your component are not being recreated on every re-render cycle...
date: "2019-08-18T22:40:32.169Z"
image: tuneup.jpg
published: true
---

If you're using [React.memo](https://reactjs.org/docs/react-api.html#reactmemo target="_blank") or [React.PureComponent](https://reactjs.org/docs/react-api.html#reactpurecomponent) to skip re-rendering on an expensive component, you'll want to make sure any object based props you are passing to your component are not being recreated on every re-render cycle, otherwise, the point of the optimization is defeated.

Such an issue arose while I was developing [React Data Table](https://github.com/jbetancur/react-data-table-component). React Data Table has a deep component tree that consists of columns, rows, cells and in some places expensive calculations such as sorting, column generation, etc...). Despite the use of `React.memo` on expensive components, the entire React Data Table library would re-render all those rows, columns, cells and perform any data based calculations whenever the parent component triggered a re-render.

## Equality & Sameness
Before we delve into the solution, it's important to briefly revisit how Javascript performs comparisons. Let's start with primitives. Primitives are strings, numbers, booleans, undefined and null (yep, undefined and null are types). These are considered value based comparisons. Meaning that comparing a primitive value to another equal primitive value will result in a true condition:

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

Because we're comparing two objects that have **different references** the result is false. Let's compare the **same object reference**:

```js
const obj = {}
obj === obj // true

const arr = []
arr === arr // true

const func = () => {}
func === func // true
```

As expected, comparing the same reference is true because comparing `obj` to itself refers to the same address in memory. You might be thinking what happens if I mutate `obj`? Will it stil be equal?

```js
const obj = {}
obj.hello = 'world'

obj === obj // true
```

Yep, it's still true because the `obj` reference (location in memory) did not change.

So, if you really wanted to make sure `obj` is truly equal to some other object you would need to iterate through each property in both objects. Luckily, React will perform a shallow comparison of the old props (before re-render) and the new props (after re-render) when using `React.memo` and `React.PureComponent` (I'll cover shallow vs. deep comparisons in a future post). 

The main takeaway is that `{}` is not the same reference or equality to `{}`, therefore, React will treat these as different instances of your object when performing it's comparisons. Hold onto this tidbit of knowledge as it's going to take us far into making sure `React.memo` and `React.PureComponent` are actually solving our re-rendering issue.

*Checkout [Equality comparisons and sameness](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness) if you want a deeper dive.*

## Checking props for Equality
This concept took me way too long to grasp, but think of React components as functions (with props) that are called when the component first mounts (i.e. the function is first called), then subsequently every time a state change originates from a parent or within the component itself. 

As mentioned previously, `React.PureComponent` or `React.memo` give us an escape hatch to the rendering process to check if our props were equal, if so, React skips the re-render. There is a certain amount of overhead to do this check so you have to be weigh the cost of a re-render vs. the cost of a prop equality check (I'll cover this in a future article).

Let's pretend that `ExpensiveChild` is some crazy expensive component. In the example below you'll notice that `ExpensiveChild` will re-render every time you click a button (i.e. the state is updated in `Parent`). You may already know that this is because `setCount` (`this.setState` in a class component) is a request for React to re-render `Parent` with the updated `count`:

<iframe src="https://codesandbox.io/embed/re-render-child-as-props-9rmg5?expanddevtools=1&fontsize=14" title="Re-render Forever" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

However, when `Parent` re-renders so React will re-render all of its children. In our case, we'd like to limit `ExpensiveChild` to only re-render when it needs to. Let's go ahead and configure our component to only re-render when its props change.

### Using React.PureComponent
By extending our class Component from `React.PureComponent` we can have React perform some shallow prop checks and detect if they have changed. If the props are all equal, re-rendering is skipped:

<iframe src="https://codesandbox.io/embed/purecomponent-66xl6?expanddevtools=1&fontsize=14" title="PureComponent" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

### Using React.memo
We can do the same thing for a functional component by wrapping it with `React.memo`:

<iframe src="https://codesandbox.io/embed/re-render-forever-hvsf6?expanddevtools=1&fontsize=14" title="Memo" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

In both examples above you can see that `ExpensiveChild` only renders once on mount, but subsequently is not re-rendered.

Ok, let's throw a wrench into the cogs and also pass an object. For brevity, we are going to stick with the Hooks example:

<iframe src="https://codesandbox.io/embed/re-render-forever-h28q0?expanddevtools=1&fontsize=14" title="Re-render Memo Forever" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

Damn, damn, damn. Now we're re-rendering again! Back to our comparison and sameness section above. What do you think is wrong here?

![Waiting](./waiting.gif)

Yep, you guessed it. The `data` object is being re-created every time `Parent` re-renders. Which means the shallow prop checking in `ExpensiveChild` `React.memo` is totally skipped because `data` is a different object reference. What a waste!

## Solution
We can memoize the `data` object before we pass it to `ExpensiveChild`. [Memoization](https://en.wikipedia.org/wiki/Memoization) is a fancy computer science term for caching the result of a value or function and keeping it's object reference rather than creating a new one. Here we can use the React hook `React.useMemo` (`React.useCallback` is useful when we want to memoize a function):

<iframe src="https://codesandbox.io/embed/re-render-memo-forever-ev7jh?expanddevtools=1&fontsize=14" title="Re-render Memo Fixed" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

You could of course just move the `data` variable declaration outside of the component (in the case of class components out of the render method) and it will only be created once, however, what if your `data` object is actually derived from a function that returns your data object? In this outer scope scenario you will still need to memoize it using your own memoize function to a 3rd party library like [memoize-one](https://github.com/alexreardon/memoize-one) because every function invocation will return a new result.

## Recap
After you've determined that your React component benefits from using `React.PureComponent` or `React.memo` it's important to make sure that objects, arrays or functions you pass in as props are not recreated on each render cycle. This ensures that our `React.memo` and `React.PureComponent` are doing what they were intended to do.
