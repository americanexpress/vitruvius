import { Map } from 'immutable';

export const SOME_ACTION = 'SOME_ACTION';

const buildStuffState = ({ data } = {}) => new Map({ foo: data || 'bar' });

export function stuffReducer(state = buildStuffState(), action) {
  switch (action.type) {
    case SOME_ACTION:
      return state.set('foo', action.data);
    default:
      return state;
  }
}

stuffReducer.buildInitialState = buildStuffState;

const buildThingsState = ({ data } = {}) => new Map({ bar: data || 'baz' });

export function thingsReducer(state = buildThingsState(), action) {
  switch (action.type) {
    case SOME_ACTION:
      return state.set('bar', action.data);
    default:
      return state;
  }
}

thingsReducer.buildInitialState = buildThingsState;

const buildOtherState = ({ data } = {}) => new Map({ baz: data || 'foo' });

export function otherReducer(state = buildOtherState(), action) {
  switch (action.type) {
    case SOME_ACTION:
      return state.set('baz', action.data);
    default:
      return state;
  }
}

otherReducer.buildInitialState = buildOtherState;

export function staticReducer(state = new Map({ static: true }), action) {
  switch (action.type) {
    case SOME_ACTION:
      return state.set('static', !state.get('static'));
    default:
      return state;
  }
}
