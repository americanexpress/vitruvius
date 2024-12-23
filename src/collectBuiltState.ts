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

import { Reducer } from 'redux';

import { Map } from 'immutable';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any -- Here, we see a good use of any.

usually `unknown` should be used in the case that the caller hands in something of unknown type.

However, in this case, it's not the something the caller gave us to being broadened to unknown,
it (would be) the caller narrowing unknown to something concrete. This would lead to typescript
throwing an error.

Therefore, any must be used, so that when the caller tries to hand us a reducer, typescript does not say
'This reducer should be <unknown, unknown, unknown> but its <something, something, something>, that's not allowed'.
But instead says 'aah, this should be <any, any, any>, and <something, something, something> is a valid subtype of that'.
 */
export type VitruviusReducer<Locals> = Reducer<any, any, any> & {
  buildInitialState?: (_locals: Locals) => Record<string, unknown>;
};

export type VitruviusReducers<Locals> = Record<string, VitruviusReducer<Locals>>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- see above
export type VitruviusImmutableReducer<Locals> = Reducer<any, any, any> & {
  buildInitialState?: (_locals: Locals) => Map<string, unknown>;
};

export type VitruviusImmutableReducers<Locals> = Record<string, VitruviusImmutableReducer<Locals>>;

export default function collectBuiltState<
  Locals,
  TR extends VitruviusReducers<Locals> | VitruviusImmutableReducers<Locals>
>({
  reducers,
  locals,
  defaultState,
}: {
  reducers: TR extends VitruviusImmutableReducers<Locals>
    ? VitruviusImmutableReducers<Locals>
    : VitruviusReducers<Locals>;
  locals: Locals;
  defaultState: TR extends VitruviusImmutableReducers<Locals>
    ? Map<string, unknown>
    : Record<string, unknown>;
}): TR extends VitruviusImmutableReducers<Locals> ? Map<string, unknown> : Record<string, unknown> {
  let builtState = defaultState;

  Object.keys(reducers).forEach((key) => {
    const reducer = reducers[key];
    if (typeof reducer === 'function' && typeof reducer.buildInitialState === 'function') {
      if (typeof builtState.set === 'function') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- This is the case where the users is using immutableJS However, to narrow the type here to 'typeof buildState === immutable.Map' would be a breaking change, since currently this code allows for any object with a 'set' method.
        builtState = builtState.set(key, reducer.buildInitialState(locals));
      } else {
        // @ts-expect-error -- since we cant strictly narrow the if clause above to be the Map case, we also cant strictly narrow the else clause here to be the Record case
        builtState[key] = reducer.buildInitialState(locals);
      }
    }
  });

  return builtState;
}
