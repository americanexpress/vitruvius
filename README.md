# vitruvius

[![npm version](https://badge.fury.io/js/%40americanexpress%2Fvitruvius.svg)](https://badge.fury.io/js/%40americanexpress%2Fvitruvius)
[![Build Status](https://travis-ci.org/americanexpress/vitruvius.svg?branch=master)](https://travis-ci.org/americanexpress/vitruvius)

Vitruvius extends redux's `combineReducers` to allow developers to include a
`buildInitialState` method on their reducer. This allows for the passing of
locals to build the initial state that wouldn't normally be available to a
reducer when setting its initial state. For instance, one could pass some data
from the request object.

## Installation

```
$ npm install --save @americanexpress/vitruvius
```

## Implementation

Below is an example of a reducer implementing a `buildInitialState` method and
an example of vitruvius being implemented.

```js
import { Map } from 'immutable';

export const SOME_ACTION = 'SOME_ACTION';

const buildInitialState = ({ data } = {}) => new Map({ foo: data || 'bar' });

export default function reducer(state = buildInitialState(), action) {
  switch (action.type) {
    case SOME_ACTION:
      return state.set('foo', action.data);
    default:
      return state;
  }
}

reducer.buildInitialState = buildInitialState;
```

> **TIP**: To extend `combineReducers` from `redux-immutable` instead of `redux`
import from `@americanexpress/vitruvius/immutable`.

```js
import vitruvius from '@americanexpress/vitruvius';

const reducer = vitruvius({
  stuff: stuffReducer,
  things: thingsReducer,
  ...otherReducers,
});

const store = createStore(reducer, reducer.buildInitialState(locals), enhancer);
```


## Contributing
We welcome Your interest in the American Express Open Source Community on Github.
Any Contributor to any Open Source Project managed by the American Express Open
Source Community must accept and sign an Agreement indicating agreement to the
terms below. Except for the rights granted in this Agreement to American Express
and to recipients of software distributed by American Express, You reserve all
right, title, and interest, if any, in and to Your Contributions. Please [fill
out the Agreement](https://cla-assistant.io/americanexpress/).

## License
Any contributions made under this project will be governed by the [Apache License
2.0](https://github.com/americanexpress/vitruvius/blob/master/LICENSE.txt).

## Code of Conduct
This project adheres to the [American Express Community Guidelines](https://github.com/americanexpress/vitruvius/wiki/Code-of-Conduct).
By participating, you are expected to honor these guidelines.
