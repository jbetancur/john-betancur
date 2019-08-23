---
title: Yet Another React Data Table
description: ''
date: "2019-08-09T22:40:32.169Z"
image: table.jpg
published: true
---

Creating yet another React table library came out of necessity while developing a web application for a growing startup. I discovered that while there are some great table libraries out there, most required me to implement basic features such as built in sorting and pagination or to understand the taxonomy of html tables. What I was really looking for was a table library with a declarative API and with the least amount of cognitive load.

In my industry I find myself writing a lot of UIs that require tabular views. These UIs are typically developer or infrastructure centric products where it's common to list resources such as: users, virtual machines, CI build status, containers, whatever. Sometimes, I really just need to be able to rapidly prototype a tabular view without wasting time wiring in common patterns like sorting, paging and row selection.

Wouldn't it be nice if you could just:

```js
import DataTable from 'react-data-table-component';

const data = [{ id: 1, title: 'Conan the Barbarian', year: '1982' } ...];
const columns = [
  {
    name: 'Title',
    selector: 'title',
    sortable: true,
  },
  {
    name: 'Year',
    selector: 'year',
    sortable: true,
    right: true,
  },
];

const MyComponent = () => (
  ...
  <DataTable
    title="Arnold Movies"
    columns={columns}
    data={data}
    pagination
    selectableRows
    progressPending={loading}
  />
);
```

## React Data Table Component
This is the reason I wrote [React Data Table Component](https://github.com/jbetancur/react-data-table-component). Quite a mouthful, but simple to use.

At it's most basic level all you need is an array of data and column definitions. The API of using `data` and `columns` is not an original idea by any stretch, but it's my opinion on what I think the API for a table component should be. An argument can be made for other table libraries give you access to each of the various table atoms: `Table`, `THead`, `Row`, `Cell`, `TBody`, etc. but what happens is you end up having to understand the implementation details of a table when it's likely that what you really wanted was to avoid having write one in the first place. Furthermore, it's on you to implement sorting, expandable columns, loading indicators, selectable rows, themes, etc. Why re invent the wheel?

So let's go over some examples of table use cases...

### Row Selection
No problemo.

```js

const MyComponent = () => {
  const handleRowSelected = (row) => {
    // do something with row
  };

  return (
    <DataTable
      title="Arnold Movies"
      columns={columns}
      data={data}
      selectableRows
      onRowSelected={handleRowSelected}
    />
  );
}
```

### Expandable Rows
Easy peazy.

```js
const MyComponent = () => (
  <DataTable
    title="Arnold Movies"
    columns={columns}
    data={data}
    expandableRows
    expandableRowsComponent={({ data }) => <div>{JSON.stringify(data, null, 2)}</div>}
  />
);
```

### Pagination
Party time!

```js
const MyComponent = () => (
  <DataTable
    title="Arnold Movies"
    columns={columns}
    data={data}
    pagination
  />
);
```

### Responsive
React Data Table Component is also based on flex box and uses no table elements. This gives you "flex-ibility" (ha-ha-ha) by making RDT more responsive to smaller devices. For example, you can control which columns are visible at certain media breakpoints:

```js
const columns = [
  {
    name: 'Title',
    selector: 'title',
    sortable: true,
  },
  {
    name: 'Year',
    selector: 'year',
    sortable: true,
    right: true,
    hide: '600px' // hides year when the breakpoint is less than 600px
  },
];

const MyComponent = () => (
  <DataTable
    title="Arnold Movies"
    columns={columns}
    data={data}
  />
);
```

And a bunch more...

## Community
Whenever I decide to use an open source library one of the first things I check for is community and activity. To my unexpected surprise React Data Table Component is gaining contributions and is already up to 90 something stars and over 3700 weekly downloads.

While those numbers are nothing to brag about they are growing on a weekly basis, and that is motivating me to keep the features and bug fixes coming. More importantly, it's incredibly awesome to see others so eager to report bugs, suggest features and submit PR's.

## Shut Up and Give Me React Data Table Component
Anyway, I've gone on enough. You can read more about [React Data Table Component](https://github.com/jbetancur/react-data-table-component) and look over the API documentation for yourself.

You can try out React Data Table Component in storybook [here](https://jbetancur.github.io/react-data-table-component) or play around with it in [CodeSandbox](https://codesandbox.io/embed/react-data-table-sandbox-ccyuu)

<iframe src="https://codesandbox.io/embed/react-data-table-sandbox-ccyuu?fontsize=14" title="React Data Table Sandbox" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
