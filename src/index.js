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
