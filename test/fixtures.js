import { Map } from 'immutable';

export const SOME_ACTION = 'SOME_ACTION';

export const initialState = new Map({
  foo: 'bar',
});

export function someReducer(state = initialState, action) {
  switch (action.type) {
    case SOME_ACTION:
      return state.set('foo', action.data);
    default:
      return state;
  }
}

someReducer.buildInitialState = ({ data }) => new Map({ foo: data });

export function someAction(data) {
  return {
    type: SOME_ACTION,
    data,
  };
}
