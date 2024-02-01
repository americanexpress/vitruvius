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

/* eslint-disable jest/no-export -- not a test file */
/* eslint-disable default-param-last -- avoiding rewrite */
import { Map } from 'immutable';
import { createStore } from 'redux';

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

export function runVitruviusTests(describeSpec, vitruvius) {
  // eslint-disable-next-line jest/valid-title -- dynamic tests
  return describe(describeSpec, () => {
    const locals = { data: 'test' };

    it('should handle all reducers having buildInitialState method', () => {
      const reducer = vitruvius({
        stuff: stuffReducer,
        things: thingsReducer,
        other: otherReducer,
      });
      const actual = reducer.buildInitialState(locals);
      expect(actual).toMatchSnapshot();
    });

    it('should handle no reducers having buildInitialState method', () => {
      const reducer = vitruvius({
        static: staticReducer,
      });
      const actual = reducer.buildInitialState(locals);
      expect(actual).toMatchSnapshot();
    });

    it('should handle a mix of reducers having and not having buildInitialState method', () => {
      const reducer = vitruvius({
        stuff: stuffReducer,
        things: thingsReducer,
        other: otherReducer,
        static: staticReducer,
      });
      const actual = reducer.buildInitialState(locals);
      expect(actual).toMatchSnapshot();
    });

    it('should build the expected state for a flat tree of reducers', () => {
      const reducer = vitruvius({
        stuff: stuffReducer,
        things: thingsReducer,
        other: otherReducer,
        static: staticReducer,
      });
      const actual = reducer.buildInitialState(locals);
      expect(actual).toMatchSnapshot();
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
      expect(actual).toMatchSnapshot();
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
      expect(actual).toMatchSnapshot();
    });
  });
}
/* eslint-enable jest/no-export -- not a test file */
/* eslint-enable default-param-last -- avoiding rewrite */
