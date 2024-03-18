/*-
 *
 * Hedera Token Holders List
 *
 * Copyright (C) 2024 Hedera Hashgraph, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import { filterBalances } from '@/utils/filterBalances';
import { filteredNftData } from '@/test/__mocks__/filteredNftData';
import { responses } from '@/test/__mocks__/responses';

describe('filterBalances', () => {
  it('should return list 280 accounts when isAllConditionsRequired is set to false', async () => {
    const result = filterBalances(filteredNftData, false, responses);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(280);
  });

  it('should return list of one account when isAllConditionsRequired is set to true', async () => {
    const result = filterBalances(filteredNftData, true, responses);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(1);
  });
});
