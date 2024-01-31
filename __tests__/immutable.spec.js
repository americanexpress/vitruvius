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

import vitruviusImmutable from '../src/immutable';
import vitruviusImmutableExport from '../immutable';
import { runVitruviusTests } from './fixtures';

// eslint-disable-next-line global-require  -- no context
jest.mock('../lib/immutable', () => require('../src/immutable'), { virtual: true });

runVitruviusTests('vitruviusImmutable', vitruviusImmutable);

describe('vitruviusImmutable export', () => {
  it('should export vitruviusImmutable', () => {
    expect(vitruviusImmutableExport.name).toBe('vitruviusImmutable');
  });
});
