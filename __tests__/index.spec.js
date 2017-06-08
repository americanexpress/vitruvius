/*
 * Copyright (c) 2017 American Express Travel Related Services Company, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */

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
