---
title: When to use PureComponent and Memo
description: ''
date: "2019-08-19T22:40:32.169Z"
published: false
---


## BTW, you may not need React.memo or React.PureComponent
It's a common misconception that you need to wrap all your components in a `React.PureComponent` or `React.memo` to prevent those evil re-renders. Applying shallow checking in this blind manner may either have no performance impact or it may slow things down depending on how many props you're comparing. Additionally, React performs something called reconciliation where it only compares what changed in your HTML before committing a change to the DOM.

A good rule of thumb is components that contain little or basic logic are better off re-rendering all the live long day whereas components with expensive calculations should typically only re-render when their props or state actually change. This is where `React.PureComponent` or `React.memo` are useful when used correctly.
