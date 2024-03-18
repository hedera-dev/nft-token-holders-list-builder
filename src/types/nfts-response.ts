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
type NFT = {
  account_id: string;
  created_timestamp: string;
  delegating_spender: null;
  deleted: boolean;
  metadata: string;
  modified_timestamp: string;
  serial_number: number;
  spender: null;
  token_id: string;
};

type Links = {
  next: null | string;
};

export type NftsResponseType = {
  nfts: NFT[];
  links: Links;
};
