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

jest.mock('@hashgraph/hedera-nft-sdk', () => ({
  getHolderAndDuration: jest
    .fn()
    .mockResolvedValueOnce({ holder: '0.0.4396303', holderSince: '2024-02-02T17:51:43+01:00' })
    .mockResolvedValueOnce({ holder: '0.0.4396303', holderSince: '2024-02-04T03:38:04+01:00' })
    .mockResolvedValueOnce({ holder: '0.0.1749667', holderSince: '2023-07-15T08:10:07+02:00' })
    .mockResolvedValueOnce({ holder: '0.0.1749667', holderSince: '2023-07-14T03:11:40+02:00' })
    .mockResolvedValueOnce({ holder: '0.0.1733400', holderSince: '2023-07-11T15:00:26+02:00' })
    .mockResolvedValueOnce({ holder: '0.0.1733400', holderSince: '2023-07-11T15:01:39+02:00' })
    .mockResolvedValueOnce({ holder: '0.0.1338071', holderSince: '2023-07-11T20:30:13+02:00' })
    .mockResolvedValueOnce({ holder: '0.0.1338071', holderSince: '2023-07-11T20:23:57+02:00' })
    .mockResolvedValueOnce({ holder: '0.0.1338071', holderSince: '2023-07-11T20:23:57+02:00' })
    .mockResolvedValueOnce({ holder: '0.0.848824', holderSince: '2023-07-19T10:25:57+02:00' })
    .mockResolvedValueOnce({ holder: '0.0.845200', holderSince: '2023-07-12T13:03:29+02:00' })
    .mockResolvedValueOnce({ holder: '0.0.845200', holderSince: '2023-07-12T13:01:02+02:00' })
    .mockResolvedValueOnce({ holder: '0.0.845200', holderSince: '2023-07-13T04:29:57+02:00' })
    .mockResolvedValueOnce({ holder: '0.0.501869', holderSince: '2023-07-10T19:00:16+02:00' })
    .mockResolvedValueOnce({ holder: '0.0.501869', holderSince: '2023-07-07T16:59:55+02:00' })
    .mockResolvedValueOnce({ holder: '0.0.501869', holderSince: '2023-07-07T17:00:33+02:00' })
    .mockResolvedValueOnce({ holder: '0.0.501869', holderSince: '2023-07-11T15:02:35+02:00' })
    .mockResolvedValueOnce({ holder: '0.0.501869', holderSince: '2023-07-07T17:00:49+02:00' })
    .mockResolvedValueOnce({ holder: '0.0.501869', holderSince: '2023-07-07T17:00:15+02:00' }),
}));

describe('fetchNftsWithDuration', () => {
  it('should return only balances with their nfts being held longer than duration. There should be min 2 nft accepting this criteria', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-03-18T17:51:43+01:00'));
    const result = await fetchNftsWithDuration(HashBashExampleBalances, () => null);

    expect(result).toEqual([
      {
        account: '0.0.4396303',
        balance: 14,
        decimals: 0,
        duration: '6',
        durationType: 'months',
        isDurationSelect: true,
        isNFT: true,
        minAmount: '2',
        tokenId: '0.0.3103996',
      },
      {
        account: '0.0.1749667',
        balance: 17,
        decimals: 0,
        duration: '6',
        durationType: 'months',
        isDurationSelect: true,
        isNFT: true,
        minAmount: '2',
        tokenId: '0.0.3103996',
      },
    ]);
  });
});
