---
title: When to use PureComponent and Memo
date: "2019-08-19T22:40:32.169Z"
description: While pre-optimization can sometimes be the root of all evil there are times when you need to use shallow prop comparisons such as React.memo and React.PureComponent. But what happens when you've done that and your component still re-renders?
published: false
---


## BTW, you may not need React.memo or React.PureComponent
It's a common misconception that you need to wrap all your components in a `React.PureComponent` or `React.memo` to prevent those evil re-renders. Applying shallow checking in this blind manner may either have no performance impact or it may slow things down depending on how many props you're comparing. Additionally, React performs something called reconciliation where it only compares what changed in your HTML before committing a change to the DOM.

A good rule of thumb is components that contain little or basic logic are better off re-rendering all the live long day whereas components with expensive calculations should typically only re-render when their props or state actually change. This is where `React.PureComponent` or `React.memo` are useful when used correctly.
