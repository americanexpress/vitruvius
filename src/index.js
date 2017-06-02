import { combineReducers } from 'redux';

export default function vitruvius(reducers) {
  const combined = combineReducers(reducers);

  combined.buildInitialState = function buildInitialState(locals) {
    const builtState = {};

    Object.keys(reducers).forEach((key) => {
      const reducer = reducers[key];
      if (typeof reducer === 'function' && typeof reducer.buildInitialState === 'function') {
        builtState[key] = reducer.buildInitialState(locals);
      }
    });

    return builtState;
  };

  return combined;
}
