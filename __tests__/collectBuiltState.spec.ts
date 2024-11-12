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

import { describe, it, expect } from 'vitest';
import { Map } from 'immutable';
import collectBuiltState from '../src/collectBuiltState';
import { stuffReducer, thingsReducer, otherReducer, staticReducer } from './fixtures';

describe('collectBuiltState', () => {
  const locals = { data: 'test' };

  it('should build an immutable state', () => {
    const result = collectBuiltState({
      reducers: {
        stuff: stuffReducer,
        things: thingsReducer,
        other: otherReducer,
        static: staticReducer,
      },
      locals,
      defaultState: Map(),
    });
    expect(result).toMatchSnapshot();
  });

  it('should build a mutable state', () => {
    const result = collectBuiltState({
      reducers: {
        stuff: stuffReducer,
        things: thingsReducer,
        other: otherReducer,
        static: staticReducer,
      },
      locals,
      defaultState: {},
    });
    expect(result).toMatchSnapshot();
  });
});
