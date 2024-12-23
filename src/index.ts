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

import {
  ActionFromReducersMapObject,
  combineReducers,
  PreloadedStateShapeFromReducersMapObject,
  Reducer,
  StateFromReducersMapObject,
} from 'redux';

import collectBuiltState, { VitruviusReducers } from './collectBuiltState';

// partially taken from the type of combineReducers as Parameters<typeof combineReducers>[0] cannot be used
export type ReduxCombinedReducer<M> = Reducer<
  StateFromReducersMapObject<M>,
  ActionFromReducersMapObject<M>,
  Partial<PreloadedStateShapeFromReducersMapObject<M>>
>;

// internal type for use before assigning buildInitial state
type VitruviusOptionalCombinedReducer<Locals, M> = ReduxCombinedReducer<M> & {
  buildInitialState?: (_locals: Locals) => Record<string, unknown>;
};

export type VitruviusCombinedReducer<Locals, M> = ReduxCombinedReducer<M> & {
  buildInitialState: (_locals: Locals) => Record<string, unknown>;
};

export default function vitruvius<Locals, M extends VitruviusReducers<Locals>>(
  reducers: M
): VitruviusCombinedReducer<Locals, M> {
  const combined: VitruviusOptionalCombinedReducer<Locals, M> = combineReducers(reducers);

  combined.buildInitialState = function buildInitialState(locals: Locals) {
    return collectBuiltState<Locals, VitruviusReducers<Locals>>({
      reducers,
      locals,
      defaultState: {},
    });
  };

  // Since buildInitialState has just been asigned, it is not undefined, and this cast is safe
  return combined as VitruviusCombinedReducer<Locals, M>;
}
