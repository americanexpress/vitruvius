# vitruvius

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

```js
const reducer = virtuvius({
  stuff: stuffReducer,
  things: thingsReducer,
  ...otherReducers,
});

const store = createStore(reducer, reducer.buildInitialState(locals), enhancer);
```
