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
import { createFetchUrl } from '@/utils/createFetchUrl';
import { TokenDetails } from '@/types/tokenDetails-response';
import { USDCDetails } from '@/test/__mocks__/USDCDetails';
import { HashBashDetails } from '@/test/__mocks__/HashBashDetails';

jest.mock('@/utils/const', () => ({
  nodeUrl: 'http://localhost:3000',
}));

describe('createFetchUrl', () => {
  const tokenDetailsList: TokenDetails[] = [USDCDetails, HashBashDetails];

  it('should return the correct URL for non-NFT tokens', () => {
    const url = createFetchUrl(USDCDetails.token_id, '100', false, tokenDetailsList);
    expect(url).toBe(`http://localhost:3000/api/v1/tokens/${USDCDetails.token_id}/balances?account.balance=gte:100000000&limit=100`);
  });

  it('should return the correct URL for NFT tokens', () => {
    const url = createFetchUrl(HashBashDetails.token_id, '100', true, tokenDetailsList);
    expect(url).toBe(`http://localhost:3000/api/v1/tokens/${HashBashDetails.token_id}/balances?account.balance=gte:100&limit=100`);
  });
});
