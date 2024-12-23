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

import { combineReducers } from 'redux-immutable';
import { Map } from 'immutable';
import collectBuiltState, { VitruviusImmutableReducers } from './collectBuiltState';

// internal type for use before assigning buildInitial state
type VitruviusImmutableOptionalCombinedReducer<Locals> = ReturnType<typeof combineReducers> & {
  buildInitialState?: (_locals: Locals) => Map<string, unknown>;
};

export type VitruviusImmutableCombinedReducer<Locals> = ReturnType<typeof combineReducers> & {
  buildInitialState: (_locals: Locals) => Map<string, unknown>;
};

export default function vitruviusImmutable<Locals>(
  reducers: VitruviusImmutableReducers<Locals>,
  getDefaultState = Map<string, unknown>
): VitruviusImmutableCombinedReducer<Locals> {
  const combined: VitruviusImmutableOptionalCombinedReducer<Locals> = combineReducers(
    reducers,
    getDefaultState
  ) as VitruviusImmutableOptionalCombinedReducer<Locals>;

  combined.buildInitialState = function buildInitialState(locals): Map<string, unknown> {
    return collectBuiltState<Locals, VitruviusImmutableReducers<Locals>>({
      reducers,
      locals,
      defaultState: getDefaultState(),
    });
  };

  return combined as VitruviusImmutableCombinedReducer<Locals>;
}
