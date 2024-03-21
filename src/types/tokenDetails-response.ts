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
type Key = {
  _type: string;
  key: string;
};

type Amount = {
  denominator: number;
  numerator: number;
};

type RoyaltyFee = {
  all_collectors_are_exempt: boolean;
  amount: Amount;
  collector_account_id: string;
  fallback_fee: null;
};

type CustomFees = {
  created_timestamp: string;
  fixed_fees: any[];
  royalty_fees?: RoyaltyFee[];
};

export type TokenDetails = {
  admin_key: Key;
  auto_renew_account: string | null;
  auto_renew_period: number | null;
  created_timestamp: string;
  custom_fees: CustomFees;
  decimals: string;
  deleted: boolean;
  expiry_timestamp: number;
  fee_schedule_key: Key | null;
  freeze_default: boolean;
  freeze_key: Key | null;
  initial_supply: string;
  kyc_key: Key | null;
  max_supply: string;
  memo: string;
  modified_timestamp: string;
  name: string;
  pause_key: Key | null;
  pause_status: string;
  supply_key: Key;
  supply_type: string;
  symbol: string;
  token_id: string;
  total_supply: string;
  treasury_account_id: string;
  type: string;
  wipe_key: Key | null;
};
