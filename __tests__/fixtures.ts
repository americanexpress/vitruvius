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

/* eslint-disable default-param-last -- avoiding rewrite */
import { describe, it, expect } from 'vitest';
import { Map } from 'immutable';
import { type Action, legacy_createStore as createStore } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import vitruviusImported from '../src/index';
import vitruviusImmutableImported from '../src/immutable';
import { VitruviusImmutableReducer } from '../src/collectBuiltState';

export const SOME_ACTION = 'SOME_ACTION';

const locals = { data: 'test' };
type Locals = typeof locals;

const buildStuffState = ({ data }: { data: string } = { data: 'bar' }) => Map({ foo: data });

type StuffThingsAndOtherAction = { type: typeof SOME_ACTION; data: string };

export const stuffReducer: VitruviusImmutableReducer<Locals> = (
  state: Map<string, string> = buildStuffState(),
  action: StuffThingsAndOtherAction
) => {
  switch (action.type) {
    case SOME_ACTION:
      return state.set('foo', action.data);
    default:
      return state;
  }
};

stuffReducer.buildInitialState = buildStuffState;

const buildThingsState = ({ data }: { data: string } = { data: 'baz' }) => Map({ bar: data });

export const thingsReducer = (state = buildThingsState(), action: StuffThingsAndOtherAction) => {
  switch (action.type) {
    case SOME_ACTION:
      return state.set('bar', action.data);
    default:
      return state;
  }
};

thingsReducer.buildInitialState = buildThingsState;

const buildOtherState = ({ data }: { data: string } = { data: 'foo' }) => Map({ baz: data });

export function otherReducer(state = buildOtherState(), action: StuffThingsAndOtherAction) {
  switch (action.type) {
    case SOME_ACTION:
      return state.set('baz', action.data);
    default:
      return state;
  }
}

otherReducer.buildInitialState = buildOtherState;

export function staticReducer(state = Map({ static: true }), action: Action) {
  switch (action.type) {
    case SOME_ACTION:
      return state.set('static', !state.get('static'));
    default:
      return state;
  }
}

export function runVitruviusTests(describeSpec: string, vitruvius: typeof vitruviusImported) {
  return describe(describeSpec, () => {
    it('should handle all reducers having buildInitialState method', () => {
      const reducers = {
        stuff: stuffReducer,
        things: thingsReducer,
        other: otherReducer,
      };
      const reducer = vitruvius<typeof locals, typeof reducers>(reducers);
      const actual = reducer.buildInitialState(locals);
      expect(actual).toMatchSnapshot();
    });

    it('should handle no reducers having buildInitialState method', () => {
      const reducers = {
        static: staticReducer,
      };
      const reducer = vitruvius<typeof locals, typeof reducers>(reducers);
      const actual = reducer.buildInitialState(locals);
      expect(actual).toMatchSnapshot();
    });

    it('should handle a mix of reducers having and not having buildInitialState method', () => {
      const reducers = {
        stuff: stuffReducer,
        things: thingsReducer,
        other: otherReducer,
        static: staticReducer,
      };
      const reducer = vitruvius<typeof locals, typeof reducers>(reducers);
      const actual = reducer.buildInitialState(locals);
      expect(actual).toMatchSnapshot();
    });

    it('should build the expected state for a flat tree of reducers', () => {
      const reducers = {
        stuff: stuffReducer,
        things: thingsReducer,
        other: otherReducer,
        static: staticReducer,
      };
      const reducer = vitruvius<typeof locals, typeof reducers>(reducers);
      const actual = reducer.buildInitialState(locals);
      expect(actual).toMatchSnapshot();
    });

    it('should build the expected state for a nested tree of reducers', () => {
      const nestedReducers = {
        things: thingsReducer,
        other: otherReducer,
      };
      const reducers = {
        stuff: stuffReducer,
        nested: vitruvius<typeof locals, typeof nestedReducers>(nestedReducers),
      };
      const reducer = vitruvius<typeof locals, typeof reducers>(reducers);
      const actual = reducer.buildInitialState(locals);
      expect(actual).toMatchSnapshot();
    });

    it("should return an initialState that is acceptable to redux's createStore", () => {
      const reducers = {
        stuff: stuffReducer,
        things: thingsReducer,
        other: otherReducer,
        static: staticReducer,
      };
      const reducer = vitruvius<typeof locals, typeof reducers>(reducers);
      const store = createStore(reducer, reducer.buildInitialState(locals));
      const actual = store.getState();
      expect(actual).toMatchSnapshot();
    });

    it("should return an initialState that is acceptable to redux toolkit's configureStore", () => {
      const reducers = {
        stuff: stuffReducer,
        things: thingsReducer,
        other: otherReducer,
        static: staticReducer,
      };
      const reducer = vitruvius<typeof locals, typeof reducers>(reducers);
      const store = configureStore({ reducer, preloadedState: reducer.buildInitialState(locals) });
      const actual = store.getState();
      expect(actual).toMatchSnapshot();
    });
  });
}

export function runVitruviusImmutableTests(
  describeSpec: string,
  vitruvius: typeof vitruviusImmutableImported
) {
  return describe(describeSpec, () => {
    it('should handle all reducers having buildInitialState method', () => {
      const reducer = vitruvius<typeof locals>({
        stuff: stuffReducer,
        things: thingsReducer,
        other: otherReducer,
      });
      const actual = reducer.buildInitialState(locals);
      expect(actual).toMatchSnapshot();
    });

    it('should handle no reducers having buildInitialState method', () => {
      const reducer = vitruvius<typeof locals>({
        static: staticReducer,
      });
      const actual = reducer.buildInitialState(locals);
      expect(actual).toMatchSnapshot();
    });

    it('should handle a mix of reducers having and not having buildInitialState method', () => {
      const reducers = {
        stuff: stuffReducer,
        things: thingsReducer,
        other: otherReducer,
        static: staticReducer,
      };
      const reducer = vitruvius<typeof locals>(reducers);
      const actual = reducer.buildInitialState(locals);
      expect(actual).toMatchSnapshot();
    });

    it('should build the expected state for a flat tree of reducers', () => {
      const reducers = {
        stuff: stuffReducer,
        things: thingsReducer,
        other: otherReducer,
        static: staticReducer,
      };
      const reducer = vitruvius<typeof locals>(reducers);
      const actual = reducer.buildInitialState(locals);
      expect(actual).toMatchSnapshot();
    });

    it('should build the expected state for a nested tree of reducers', () => {
      const nestedReducers = {
        things: thingsReducer,
        other: otherReducer,
      };
      const reducers = {
        stuff: stuffReducer,
        nested: vitruvius<typeof locals>(nestedReducers),
      };
      const reducer = vitruvius<typeof locals>(reducers);
      const actual = reducer.buildInitialState(locals);
      expect(actual).toMatchSnapshot();
    });

    it("should return an initialState that is acceptable to redux's createStore", () => {
      const reducers = {
        stuff: stuffReducer,
        things: thingsReducer,
        other: otherReducer,
        static: staticReducer,
      };
      const reducer = vitruvius<typeof locals>(reducers);
      const store = createStore(reducer, reducer.buildInitialState(locals));
      const actual = store.getState();
      expect(actual).toMatchSnapshot();
    });
  });
}
/* eslint-enable default-param-last -- avoiding rewrite */
