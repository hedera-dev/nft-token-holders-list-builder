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
import { fetchNftsWithDuration } from '@/utils/fetchNftsWithDuration';
import { HashBashExampleBalances } from '@/test/__mocks__/HashBashExampleBalances';

describe('fetchNftsWithDuration', () => {
  it('should ', async () => {
    const result = await fetchNftsWithDuration(HashBashExampleBalances);

    expect(result).toEqual('0.0.1749667, 0.0.1733400, 0.0.1338071, 0.0.848824, 0.0.501869');
  });
});
