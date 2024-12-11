# vitruvius

[![npm version](https://badge.fury.io/js/%40americanexpress%2Fvitruvius.svg)](https://badge.fury.io/js/%40americanexpress%2Fvitruvius)
![Health Check](https://github.com/americanexpress/vitruvius/workflows/Health%20Check/badge.svg)

Vitruvius extends redux's `combineReducers` to allow developers to include a
`buildInitialState` method on their reducer. This allows for the passing of
locals to build the initial state that wouldn't normally be available to a
reducer when setting its initial state. For instance, one could pass some data
from the request object.

> Want to get paid for your contributions to `vitruvius`?
> Send your resume to oneamex.careers@aexp.com

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

const buildInitialState = ({ data } = {}) => Map({ foo: data || 'bar' });

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
> import from `@americanexpress/vitruvius/immutable`.

```js
import vitruvius from '@americanexpress/vitruvius';

const reducer = vitruvius({
  stuff: stuffReducer,
  things: thingsReducer,
  ...otherReducers,
});
```

## Typescript Implementation

When working with typescript, you have the option to specify the type of the 'locals' passed into buildInitialState.

If the locals type you provide conflicts with the parameter type for buildInitialState in any of the reducers in your set, you will get a type error.

For this to work end to end, you should use the vitruvious helper type to type your reducer, and pass locals to both that, and vitruvious as type templates

Take this example reducer:

```typescript
import { Map } from 'immutable';

type Locals = {
  data: string;
};

export const SOME_ACTION = 'SOME_ACTION';

const buildInitialState = ({ data }: { data: string } = { data: 'bar' }) =>
  Map({ foo: data || 'bar' });

const reducer: VitruviusReducer<Locals> = (
  state = buildInitialState(),
  action
) => {
  switch (action.type) {
    case SOME_ACTION:
      return state.set('foo', action.data);
    default:
      return state;
  }
};
export default reducer;

// below will by type checked to ensure that buildInitialStates param conforms to the Locals type
reducer.buildInitialState = buildInitialState;
```

As noted, the reducer is typed with the VitruviusReducer type, which takes the Locals type as a template. The assignment of buildInitialState is now type checked to ensure that the Locals type is respected.

Then you can pass Locals in again when creating the combined reducer. Note, you must also pass the typeof reducers:

```typescript
import vitruvius from '@americanexpress/vitruvius';

const reducers = {
  stuff: stuffReducer,
  things: thingsReducer,
  ...otherReducers,
};

// Types will also be checked here, that any reducer that has a buildInitialState method conforms to the Locals type
const reducer = vitruvius<Locals, typeof reducers>(reducers);
```

With immutable vitruvius its even simpler, because the type of reducers is not needed (since immutable does not generate good types for an immutable reducer).

Note: The reducers should use `VitruviusImmutableReducer` instead of `VitruviusReducer` as their type

```typescript
import vitruvius from '@americanexpress/vitruvius/immutable';

// Types will be checked here, that any reducer that has a buildInitialState method conforms to the Locals type
const reducer = vitruvius<Locals>({
  stuff: stuffReducer,
  things: thingsReducer,
  ...otherReducers,
});
```

## Use with Typescript and a framework

If you are using vitruvious with a framework that supports it, you would expect that framwork to export to you the type of Locals that it will call your buildInitialState with. Check the documentation of the framework to see what that type is, and use it in the generic for VitruviusReducer, VitruviusImmutableReducer,and vitruvius itself.

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

```

```
