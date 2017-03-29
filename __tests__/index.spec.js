import { Map } from 'immutable';
import { createStore } from 'redux';
import vitruvius from '../src';
import {
  stuffReducer,
  thingsReducer,
  otherReducer,
  staticReducer,
} from './fixtures';

describe('vitruvius', () => {
  const locals = { data: 'test' };

  it('should handle all reducers having buildInitialState method', () => {
    const reducer = vitruvius({
      stuff: stuffReducer,
      things: thingsReducer,
      other: otherReducer,
    });
    const actual = reducer.buildInitialState(locals);
    const expected = {
      stuff: new Map({ foo: locals.data }),
      things: new Map({ bar: locals.data }),
      other: new Map({ baz: locals.data }),
    };
    expect(actual).toEqual(expected);
  });

  it('should handle no reducers having buildInitialState method', () => {
    const reducer = vitruvius({
      static: staticReducer,
    });
    const actual = reducer.buildInitialState(locals);
    expect(actual).toEqual({});
  });

  it('should handle a mix of reducers having and not having buildInitialState method', () => {
    const reducer = vitruvius({
      stuff: stuffReducer,
      things: thingsReducer,
      other: otherReducer,
      static: staticReducer,
    });
    const actual = reducer.buildInitialState(locals);
    const expected = {
      stuff: new Map({ foo: locals.data }),
      things: new Map({ bar: locals.data }),
      other: new Map({ baz: locals.data }),
    };
    expect(actual).toEqual(expected);
  });

  it('should build the expected state for a flat tree of reducers', () => {
    const reducer = vitruvius({
      stuff: stuffReducer,
      things: thingsReducer,
      other: otherReducer,
      static: staticReducer,
    });
    const actual = reducer.buildInitialState(locals);
    const expected = {
      stuff: new Map({ foo: locals.data }),
      things: new Map({ bar: locals.data }),
      other: new Map({ baz: locals.data }),
    };
    expect(actual).toEqual(expected);
  });

  it('should build the expected state for a nested tree of reducers', () => {
    const reducer = vitruvius({
      stuff: stuffReducer,
      nested: vitruvius({
        things: thingsReducer,
        other: otherReducer,
      }),
    });
    const actual = reducer.buildInitialState(locals);
    const expected = {
      stuff: new Map({ foo: locals.data }),
      nested: {
        things: new Map({ bar: locals.data }),
        other: new Map({ baz: locals.data }),
      },
    };
    expect(actual).toEqual(expected);
  });

  it('should return an initialState that is acceptable to redux\'s createStore', () => {
    const reducer = vitruvius({
      stuff: stuffReducer,
      things: thingsReducer,
      other: otherReducer,
      static: staticReducer,
    });
    const store = createStore(reducer, reducer.buildInitialState(locals));
    const actual = store.getState();
    const expected = {
      stuff: new Map({ foo: locals.data }),
      things: new Map({ bar: locals.data }),
      other: new Map({ baz: locals.data }),
      static: new Map({ static: true }),
    };
    expect(actual).toEqual(expected);
  });
});
